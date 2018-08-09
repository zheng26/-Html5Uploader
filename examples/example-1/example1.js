// 通过传入id, 生成上传input的方式
import rfFn from '../../src/upload.js';

let option={
    id: 'example1',
    multiple: true,
    autoUpload: true,
    uploadOption: {
         srv: 'xxx',
         params: {}
    },
    chunkSize: 1024 * 1024 * 10,
    onFilter: (fs)=>{
        console.log('this is instance onFilter');
        return fs;
    },
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
let curUpload = new rfFn(option);
