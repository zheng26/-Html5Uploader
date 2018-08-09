// todo 选择一个更好的
importScripts('./spark-md5.min.js');
importScripts('./rusha.min.js');

// data = {
//     // 文件信息
//     file: '',
//     // 分块读取的信息
//     chunk: {
//         // 开始读取的大小
//         s: '',
//         // 每次读取的大小
//         chunkSize: ''
//     }
// }

let fileSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;

function readFn(f, start, chunk) {
    let totalSize = f.size;
    let name = f.name;
    let spark = new SparkMD5.ArrayBuffer();
    let rusha = new Rusha();
    rusha.resetState();
    return new Promise((resolve, reject) => {
        let readObj = new FileReader();
        readObj.onload = (e) => {
            start += chunk;
            let curTarget = e.target || e.srcElement;
            spark.append(curTarget.result);
            rusha.append(curTarget.result);
            if (totalSize < start) {
                resolve({
                    md5: spark.end(),
                    sha1: rusha.end(),
                    name: name,
                    size: totalSize
                })
            } else {
                let blobTmp = fileSlice.call(f, start, start + chunk);
                readObj.readAsArrayBuffer(blobTmp);
            }
        };
        readObj.onerror = (e) => {
            reject(e);
        };
        let blobTmp = fileSlice.call(f, start, start + chunk);
        readObj.readAsArrayBuffer(blobTmp);
    });
}

this.addEventListener('message', function (e) {
    let dataTmp = e.data;
    if (dataTmp.chunk) {
        readFn(dataTmp.file, dataTmp.chunk.s, dataTmp.chunk.chunkSize).then((data) => {
            this.postMessage({md5: data.md5, sha1: data.sha1, name: data.name, size: data.size});
        })
    } else {
        let md5Value = new SparkMD5.ArrayBuffer().append(dataTmp.file).end();
        // 向主线程发送message
        this.postMessage({md5: md5Value});
    }
}, false);