import uf from '../src/upload';
import 'mocha';
import {expect} from 'chai';

describe('upload feature test', ()=>{
    it('upload add Function test', ()=>{
        let optionTmp = {
            uploadOption: {
                srv: 'http://127.0.0.1:9993',
                params: {}
           }
        };
        let ufInstance = new uf(optionTmp);
        let testData = {
            id: '123'
        };
        ufInstance.add([testData]);
        expect(ufInstance.uploadQueue[0].f).to.exist;
        expect(ufInstance.uploadQueue[0].f).to.have.deep.property('id', '123');
    })

    it('upload find Function test', ()=>{
        let optionTmp = {
            uploadOption: {
                srv: 'http://127.0.0.1:9993',
                params: {}
           }
        };
        let ufInstance = new uf(optionTmp);
        let testData = {
            id: '123'
        };
        ufInstance.add([ufInstance]);
        expect(ufInstance.uploadQueue[0].f).to.exist;
        expect(ufInstance.find(ufInstance.uploadQueue[0].f)).to.have.deep.property('idx', 0);
        let uploadTmp = {
            idx: 123
        };
        let uploadArrTmp = [
            {
                idx: 1
            },
            {
                idx: 123
            }
        ];
        expect(ufInstance.find(uploadTmp, uploadArrTmp)).to.have.deep.property('idx', 1);
        uploadTmp = {
            idx: 1234
        };
        expect(ufInstance.find(uploadTmp, uploadArrTmp)).to.have.deep.property('idx', -1);

    })
})