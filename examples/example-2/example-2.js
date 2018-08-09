// 通过手动添加file对象的方式，上传文件

import rfFn from '../../src/upload.js';

function uploadCreate() {
    let option={
        multiple: true,
        autoUpload: true,
        uploadOption: {
            srv: 'xxx',
            params: {}
        },
        chunkSize: 1024 * 1024 * 10,
        onProgress: (fs, rate)=>{
            console.log('this is instance onProgress');
        },
        onSuccess: (fs, rate)=>{
            console.log('this is instance onSuccess',fs, rate);
        },
        onError: ()=>{
            console.log('this is instance onError');
        },
        onAbort: ()=>{
            console.log('this is instance onAbort');
        }
    };
    return new rfFn(option);
}

function init() {
    let uploadObj = uploadCreate();
    document.getElementById('example-2').addEventListener('change', (e) => {
        console.log('this is change event');
        let filesTmp = (e.target || e.srcElement).files || [];
        uploadObj.add(filesTmp);
    });
}

init();