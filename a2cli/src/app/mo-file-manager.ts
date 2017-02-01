import { moResource } from "./mo-resource";
import { UploadItem }    from 'angular2-http-file-upload';

export class MyUploadItem extends UploadItem {
    constructor(file: any) {
        super();
        //this.url = 'https://your.domain.here/your.endpoint';
        this.url = 'http://localhost:4201/upload';
        this.headers = { HeaderName: 'Header Value', AnotherHeaderName: 'Another Header Value' };
        this.file = file;
    }
};



export class moFileManager extends moResource {
};
