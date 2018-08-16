let fileSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;

/**
 * html5 fileReader实例
 */
class ReadFile {
    // fileReader实例
    // frInstance = '';
    // 文件句柄
    // fileObj = '';

    constructor(fileObj) {
        this.frInstance = new FileReader();
        this.fileObj = fileObj;
        this.read = (this.read).bind(this);
    }

    read(s, e) {
        this.frInstance.onloadstart = this.onloadstart.bind(this);
        this.frInstance.onload = this.onload;
        this.frInstance.onloadend = this.onloadend.bind(this);
        this.frInstance.onprogress = this.onprogress.bind(this);
        this.frInstance.onerror = this.onerror.bind(this);
        let fileObj = this.fileObj;
        if (!fileObj) {
            console.error('ReadFile do not have fileObj');
            return false;
        }
        let limitS = s || 0;
        let limitE = e || fileObj.size;
        let blobTmp = fileSlice.call(fileObj, s, e);
        this.frInstance.readAsArrayBuffer(blobTmp);
        return blobTmp;
    }

    onloadstart(e) {
    }

    onprogress(e) {
    }

    onload(e) {
    }

    onerror(e) {
    }

    onloadend(e) {
    }

}
/**
 * 实例化参数
 * option = {
 *   srv: '', 服务器地址
 *   params: {} ,  上传参数
 * };
 */
class Upload {
    // xhr = '';
    // srvUrl = '';
    // fobj = '';
    constructor(option) {
        this.option = option;
        if (!option.srv) {
            console.error('send function error (no srv)');
            return false;
        }
        let argsTmp = Upload.getParam(option.params);
        let srvUrl = option.srv;
        if (argsTmp) {
            if (srvUrl.indexOf('?') < 0) {
                srvUrl += '?' + argsTmp;
            } else {
                srvUrl += '&' + argsTmp;
            }
        }
        this.srvUrl = srvUrl;
        let xhr = new XMLHttpRequest() || new window.ActiveXObject('Msxml2.XMLHTTP');
        let uploadEvent = xhr.upload;
        uploadEvent.addEventListener('loadstart', this.loadstart.bind(this));
        uploadEvent.addEventListener('progress', this.progress.bind(this));
        uploadEvent.addEventListener('load', this.load.bind(this));
        uploadEvent.addEventListener('abort', this.abort.bind(this));
        uploadEvent.addEventListener('error', this.error.bind(this));
        uploadEvent.addEventListener('timeout', this.timeout.bind(this));
        uploadEvent.addEventListener('loadend', this.loadend.bind(this));
        // 整个请求完成
        xhr.onreadystatechange = this.finish.bind(this);
        this.xhr = xhr;
    }

    static getParam(objTmp) {
        let paramTmp = '';
        for (let k in objTmp) {
            let headSymbol = paramTmp ? '&' : '';
            let valueTmp = encodeURIComponent(objTmp[k]);
            paramTmp += `${headSymbol}${k}=${valueTmp}`;
        }
        return paramTmp
    }

    send(fileTmp, otherParams) {
        if (!fileTmp) {
            console.log('upload send nothing');
            return;
        }
        this.fobj = fileTmp;
        let xhr = this.xhr;
        let srvUrlTmp = this.srvUrl;
        if (otherParams) {
            let argsTmp = Upload.getParam(otherParams);
            if (argsTmp) {
                if (srvUrlTmp.indexOf('?') < 0) {
                    srvUrlTmp += `?${argsTmp}`;
                } else {
                    srvUrlTmp += `&${argsTmp}`;
                }
            }
        }
        xhr.open('POST', srvUrlTmp);
        if (xhr.overrideMimeType) {
            xhr.overrideMimeType('application/octet-stream');
        }
        let form = new FormData();
        form.append('file', fileTmp);
        xhr.send(form);
    }

    abortFn() {
        this.xhr.abort();
    }

    loadstartHandle(fObj, e) {
    }

    loadstart(e) {
        console.log('this is loadstart');
        this.fobj.status = 'loadstart';
        this.loadstartHandle(this.fobj, e);
    }

    loadHandle(fObj, e) {
    }

    load(e) {
        console.log('this is load');
        this.fobj.status = 'load';
        this.loadHandle(this.fobj, e);
    }

    progressHandle(fObj, e) {
    }

    progress(e) {
        console.log('this is progress');
        let rateTmp = '';
        if (e.lengthComputable) {
            rateTmp = e.loaded / e.total;
        }
        this.fobj.status = 'progress';
        this.fobj.rate = rateTmp;
        this.progressHandle(this.fobj, e);
    }

    abortHandle(fObj, e) {
    }

    abort(e) {
        console.log('this is abort');
        this.fobj.status = 'abort';
        this.abortHandle(this.fobj, e);
    }

    errorHandle(fObj, err) {
    }

    error(e) {
        console.log('this is error');
        this.fobj.status = 'error';
        this.errorHandle(this.fobj);
    }

    timeoutHandle(fObj, e) {
    }

    timeout(e) {
        console.log('this is timeout');
        this.fobj.status = 'timeout';
        this.timeoutHandle(this.fobj, e);
    }

    loadendHandle(fObj, e) {
    }

    loadend(e) {
        console.log('this is loadend');
        this.loadendHandle(this.fobj, e);
    }

    finishHandle(fObj, data) {
    }

    finish() {
        let xhrTmp = this.xhr;
        if (xhrTmp.readyState === 4) {
            let dataTmp = '';
            try {
                dataTmp = JSON.parse(xhrTmp.responseText);
            } catch (e) {
                dataTmp = xhrTmp.responseText;
            }
            if (+xhrTmp.status === 200) {
                this.finishHandle(this.fobj, dataTmp);
            } else {
                this.errorHandle(this.fobj, dataTmp);
            }
        }
    }

    off() {
        let self = this;
        let uploadEvent = this.xhr.upload;
        uploadEvent.removeEventListener('loadstart', this.loadstart.bind(self));
        uploadEvent.removeEventListener('progress', this.progress.bind(self));
        uploadEvent.removeEventListener('load', this.load.bind(self));
        uploadEvent.removeEventListener('abort', this.abort.bind(self));
        uploadEvent.removeEventListener('error', this.error.bind(self));
        uploadEvent.removeEventListener('timeout', this.timeout.bind(self));
        uploadEvent.removeEventListener('loadend', this.loadend.bind(self));
    }

}

/**
 * 上传文件工厂，提供相关方法
 * optons example: 
 * option={
 *   id: 目标id,
 *   multiple: 是否可以上传多个
 *   autoUpload: 是否自动上传
 *   synNum: 同时可以上传的个数 p.s.默认1个
 *   chunkSize:  0  当为大于0时，则以这个大小分片上传
 *   uploadOption: {  上传文件的配置
 *        srv: ''
 *        params: {
 *            md5: ''
 *        }
 *    }
 *   sameCheck: fn( resolveFn, rejectFn )  文件上传前的检测， 用于秒传 没有则不进行检测，   调用resolveFn则进行上传， 调用rejectFn则不进行上传
 *   sort: fn   // 排序 p.s. 排序的比较函数（通过对文件对象添加额外的）
 *   onFilter: fn （[file]） // 选中的文件过滤
 *   onProgress: fn   // 文件上传进度
 *   onSuccess: fn
 *   onError: fn
 *   onAbort: fn
 * }
 * 功能： 维持自己的上传队列，处理队列，只要发生错误就会被删除
 * webWorker 通过传入 { 'file': 文件对象， 'chunk': { s: 开始计算位置， chunkSize: 每片大小}}
 * webWorker 获得 { MD5: '', SHA1: '',  name: '', size: ''}
 * todo: 上传队列的处理不好，但能用
 */
class uploadFactory {
    // uploadQueue = [];
    constructor(option) {
        // {status: waiting|uploading|end, fileObj: File|Blob, level: }
        this.uploadQueue = [];
        // 处理中的队列
        this.handleQueue = [];
        this.option = option;
        this.idx = 0;
        if (option.id) {
            create(option).addEventListener('change', this.start.bind(this))
        }
        this.find.bind(this);
        this.upload.bind(this);
        this.add.bind(this);
        this.abort.bind(this);
        this.del.bind(this);
        this.loadNext.bind(this);
        this.abortByKV.bind(this);
    }

    find(uploadInstance, arrTmp) {
        if (!uploadInstance) {
            return;
        }
        let idx = uploadInstance.idx;
        arrTmp = arrTmp || this.uploadQueue;
        for (let i = 0; i < arrTmp.length; i++) {
            if (idx === arrTmp[i].idx) {
                return {
                    obj: arrTmp[i],
                    idx: i
                }
            }
        }
        return {
            obj: '',
            idx: -1
        }
    }

    upload(fObj, s) {
        if (!fObj) {
            console.error('received bad args(null)');
            return;
        }
        let {obj: curInstance} = this.find(fObj);
        if (!curInstance) {
            this.add([fObj]);
            curInstance = this.find(fObj)['obj'];
        }
        if (curInstance.f.status === 'waiting') {
            this.handleQueue.push(curInstance);
        }
        let sendF = fObj;
        let optionTmp = this.option;
        let self = this;
        if (optionTmp.chunkSize) {
            curInstance.readStart = s;
            // 分片上传不需要处理loadend
            curInstance.uploadObj.loadendHandle = () => {
            };
            checkUpload(curInstance)
                .then((msg) => {
                    return new Promise((resolve, reject) => {
                        let existJudge = self.find(curInstance);
                        if(!existJudge || !existJudge.obj){
                            return reject();
                        }
                        if (typeof optionTmp.sameCheck === 'function') {
                            msg.fObj = fObj;
                            optionTmp.sameCheck(msg, resolve, reject);
                        } else {
                            resolve();
                        }
                    })
                })
                .then((other) => {
                    return new Promise((resolve, reject) => {
                        let existJudge = self.find(curInstance);
                        if(!existJudge || !existJudge.obj){
                            return reject();
                        }
                        optionTmp.resolveTmp = resolve;
                        optionTmp.rejectTmp = reject;
                        chunkUpload(curInstance, optionTmp, other);
                    })
                })
                .then(() => {
                    self.loadend(fObj);
                })
                .catch((e) => {
                    console.log('分块上出中catch: ', e);
                    self.loadend(fObj);
                });
            return;
        }
        curInstance.uploadObj.send(sendF);
    }

    start(e) {
        let curTargtet = e.target || e.srcElement;
        let files = curTargtet.files;
        let option = this.option;
        if (typeof option.onFilter === 'function') {
            files = option.onFilter(files) || [];
            if (!files.length) {
                console.log('after start function (files is null)');
            }
        }
        this.add(files);
    }

    add(files) {
        let option = this.option;
        for (let i = 0; i < files.length; i++) {
            this.idx += 1;
            let fTmp = files[i];
            if (fTmp.status) {
                console.warn('the file instance is in the queue');
                continue;
            }
            fTmp.idx = this.idx;
            fTmp.status = 'waiting';
            let obj = {
                idx: this.idx,
                f: fTmp,
                readObj: new ReadFile(fTmp),
                uploadObj: new Upload(option.uploadOption)
            };

            obj.uploadObj.errorHandle = this.errorHandle.bind(this);
            obj.uploadObj.progressHandle = this.progressHandle.bind(this);
            // obj.uploadObj.abortHandle = this.abortHandle.bind(this);
            obj.uploadObj.finishHandle = this.finish.bind(this);
            obj.uploadObj.loadendHandle = this.loadend.bind(this);
            this.uploadQueue.push(obj);
        }
        if (option.autoUpload) {
            this.loadNext();
        }
    }

    loadNext() {
        console.log('this is loadNext function handled queue is: ', this.handleQueue);
        let handleNum = this.handleQueue.length || 0;
        let optionTmp = this.option;
        let sortFn = optionTmp.sort || '';
        if (typeof sortFn === 'function') {
            this.uploadQueue.sort(sortFn);
        }
        for (let i = 0; i < this.uploadQueue.length; i++) {
            let curFO = this.uploadQueue[i];
            let fTmp = curFO.f;
            if (fTmp.status === 'waiting' && (!handleNum || handleNum < optionTmp.synNum)) {
                this.upload(fTmp);
                handleNum += 1;
            }
        }
    }

    abort(uploadInstance) {
        if (!uploadInstance) {
            console.error('received bad args (null)');
            return;
        }
        let {obj: curInstance, idx} = this.find(uploadInstance);
        if (!curInstance) {
            console.log('[error] not fount current uploadInstance in the queue', uploadInstance);
            return;
        }
        curInstance.uploadObj.abortFn();
        for (let i = 0; i < this.handleQueue.length; i++) {
            if (uploadInstance.idx === this.handleQueue[i].idx) {
                this.handleQueue.splice(i, 1);
                break;
            }
        }
        curInstance.uploadObj.off();
        this.uploadQueue.splice(idx, 1);
    }

    abortByKV(key, value) {
        let hLen = this.handleQueue.length;
        let qLen = this.uploadQueue.length;
        let s = 0;
        while (s < hLen) {
            if (s < hLen && this.handleQueue[s] && getValue(this.handleQueue[s].f, key) === value) {
                let o = this.handleQueue[s];
                o.f.status = 'abort';
                o.uploadObj.abortFn();
                o.uploadObj.off();
                this.handleQueue.splice(s, 1);
                s -= 1;
            }
            s += 1;
            hLen = this.handleQueue.length;
        }
        s = 0;
        while (s < qLen) {
            if (s < qLen && this.uploadQueue[s] && getValue(this.uploadQueue[s].f, key) === value) {
                this.uploadQueue.splice(s, 1);
                s -= 1;
            }
            s += 1;
            qLen = this.uploadQueue.length;
        }
    }

    del(uploadInstance) {
        let {obj: curInstance, idx} = this.find(uploadInstance);
        if (!curInstance) {
            console.log('[error] not fount current uploadInstance in the queue', uploadInstance);
            return;
        }
        for (let i = 0; i < this.handleQueue.length; i++) {
            if (uploadInstance.idx === this.handleQueue[i].idx) {
                this.handleQueue.splice(i, 1);
                break;
            }
        }
        curInstance.uploadObj.off();
        this.uploadQueue.splice(idx, 1);
    }

    finish(fObj, data) {
        let option = this.option;
        if (data.code === 0 && typeof option.onSuccess === 'function') {
            option.onSuccess(fObj, data)
        } else if (data.code !== 0) {
            this.errorHandle(fObj, data)
        }
    }

    /**
     * IE才生效，有兼容问题
     * @param {*} fObj 
     * @param {*} e 
     */
    abortHandle(fObj, e) {
        if (this.option.onAbort) {
            let {obj: curInstance} = this.find(fObj);
            this.option.onAbort(curInstance.f, e);
        }
        this.del(fObj);
        this.loadNext();
    }

    errorHandle(fObj, err) {
        if (this.option.onError) {
            let {obj: curInstance} = this.find(fObj);
            if (curInstance && curInstance.f.status !== 'abort') {
                this.option.onError(curInstance.f, err);
            }
        }
        this.del(fObj);
        this.loadNext();
    }

    loadend(fObj, e) {
        this.del(fObj);
        this.loadNext();
    }

    progressHandle(fObj, e) {
        console.log('this is progressHandle');
        let {obj: curInstance} = this.find(fObj);
        if (!curInstance) {
            return;
        }
        if (this.option.onProgress) {
            let fTmp = curInstance.f;
            fTmp.uploadedSize = fTmp.uploadedSize || 0;
            let rateTmp = (fTmp.uploadedSize + fObj.rate * fObj.size) / fTmp.size;
            fTmp.rate = rateTmp;
            this.option.onProgress(fTmp, e);
        }
    }

}

/**
 * 分块读取
 * @param readObj readFile 实例
 * @param startPos 开始读取的位置
 * @param chunkSize 读取的大小
 * @returns {Promise}
 */
function chunkReader(readObj, startPos, chunkSize) {
    return new Promise((resolve, reject) => {
        let workerTmp = '';
        let partF = '';
        readObj.onload = (e) => {
            workerTmp = new Worker('/lib/file-worker.js');
            let curTarget = e.target || e.srcElement;
            workerTmp.postMessage({
                file: curTarget.result
            });
            workerTmp.onmessage = (msg) => {
                console.log('this is workerTmp event: ', msg);
                resolve({fp: partF, e: msg.data, ft: readObj.fileObj});
                workerTmp.terminate();
            };
        };
        readObj.onerror = (e) => {
            reject(e);
        };
        partF = readObj.read(startPos, startPos + chunkSize);
        partF.idx = readObj.fileObj.idx;
        if (!partF) {
            reject('can not find the read function');
        }
    });
}

/**
 * 整个文件的md5计算，用于判断是否存在
 * @param {*} curInstance 
 */
function checkUpload(curInstance) {
    let chunkTmp = 1024 * 1024 * 2;
    let sizeTmp = curInstance.f.size;
    return new Promise((resolve, reject) => {
        try {
            let workerTmp = new Worker('/lib/file-worker.js');
            workerTmp.postMessage({
                file: curInstance.f,
                chunk: {
                    s: 0,
                    chunkSize: chunkTmp
                }
            });
            workerTmp.onmessage = (msg) => {
                console.log('this is workerTmp event: ', msg);
                resolve(msg.data);
                workerTmp.terminate();
            };
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * 分块上传
 * @param obj upload factory 组装的实例
 * @param option
 */
function chunkUpload(obj, option, other) {
    other = other || {};
    let chunkSize = option.chunkSize;
    obj.readStart = (other && other.readStart) || obj.readStart || 0;
    let startPos = obj.readStart || 0;
    let totalSize = obj.f.size;
    // 读取指定块的md5
    chunkReader(obj.readObj, startPos, chunkSize).then(data => {
        obj.uploadObj.finishHandle = (fObj, dataTmp) => {
            // fObj.readStart = data.fp.size;
            if (dataTmp.code !== 0 || obj.errNum > 10) {
                if (obj.errNum > 10) {
                    console.error('读取片数超过10次');
                }
                if (typeof option.onError === 'function') {
                    option.onError(obj.f, dataTmp)
                }
                return option.resolveTmp();
            } else if (obj.readStart + chunkSize < totalSize) {
                let sTmp = getValue(dataTmp, 'data.detail.index') || 0;
                // 读取重复片数限制
                if (obj.readStart === sTmp) {
                    obj.errNum = (obj.errNum || 0) + 1;
                } else {
                    obj.errNum = 0;
                }
                obj.f.uploadedSize = sTmp;
                obj.readStart = sTmp;
                chunkUpload(obj, option, other)
            } else {
                if (typeof option.onSuccess === 'function') {
                    option.onSuccess(obj.f, dataTmp)
                }
                return option.resolveTmp();
            }
        };
        if (obj.f.status === 'abort') {
            return;
        }
        let leftChunk = totalSize - obj.readStart;
        let optionTmp = {
            md5: data.e.md5,
            name: obj.f.name,
            length: leftChunk >= chunkSize ? chunkSize : leftChunk,
            index: obj.readStart,
            uploadId: other.uploadId
        };
        obj.f.readSize = optionTmp.index + optionTmp.length;
        obj.uploadObj.send(data.fp, optionTmp);
    }, err => {
        console.error('uploadfactory upload error: ', err);
        return option.resolveTmp();
    });
}

/**
 * 创建input上传选择
 * @param {*} option
 */
function create(option) {
    if (!option.id) {
        console.error('create received bad arg(id not existed)', option);
        return;
    }
    let childDom = document.createElement('input');
    childDom.type = 'file';
    (option.multi) && (childDom['multiple'] = '');
    document.getElementById(option.id).appendChild(childDom);
    return childDom;
}

/**
 * 读取对象指定value
 * @param obj
 * @param key
 * @returns {*}
 */
function getValue(obj, key) {
    let keyArr = key.split('.');
    for (let i = 0; i < keyArr.length; i++) {
        if (!obj) {
            return NaN;
        }
        obj = obj[keyArr[i]] || '';
    }
    return obj;
}

export default uploadFactory