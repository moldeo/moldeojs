import { Http } from "@angular/http";
//import { File } from "@angular/";

import { moAbstract } from "./mo-abstract";
import { moText, moText0, moTextArray } from "./mo-text";
import { MOlong, MOint, MOulong, MOuint, MOfloat, MOdouble, MOubyte } from "./mo-types";
import { moResource } from "./mo-resource";
import { UploadItem } from 'angular2-http-file-upload';

export class MyUploadItem extends UploadItem {
    constructor(file: any) {
        super();
        //this.url = 'https://your.domain.here/your.endpoint';
        this.url = 'http://localhost:4201/upload';
        this.headers = { HeaderName: 'Header Value', AnotherHeaderName: 'Another Header Value' };
        this.file = file;
    }
};


/**
* Los distintos tipos de accesos a los archivos soportados por el moFileManager
*/

export enum moFileType {
	MO_FILETYPE_LOCAL,
	MO_FILETYPE_HTTP,
	MO_FILETYPE_FTP,
	MO_FILETYPE_HTTPS,
	MO_FILETYPE_FTPS,
	MO_FILETYPE_UDP,
	MO_FILETYPE_UTP
};

export type moFileDate = MOlong;
export type moFileSize = MOlong;

/**
* Estado del archivo
*/
export enum moFileStatus {
	MO_FILESTATUS_READY,
	MO_FILESTATUS_DOWNLOADING,
	MO_FILESTATUS_STREAMING,
	MO_FILESTATUS_NOT_READY
};

export const moSlash : moText = "/";

export class moFile extends moAbstract {

  _File: File;
//  private http: Http;
//
    m_FileType : moFileType = moFileType.MO_FILETYPE_LOCAL;
		m_FileStatus : moFileStatus = moFileStatus.MO_FILESTATUS_NOT_READY;

		m_FileDate : moFileDate;
		m_FileSize : moFileSize = 0;

    m_CompletePath : moText = "";
		m_Drive : moText = "";

		m_Path : moText = "";
		m_FileName : moText = "";

		m_Extension : moText = "";
		m_Protocol : moText = "";

		m_bExists : boolean = false;
		m_bRemote : boolean = false;
		//buckets...for downloading...
		//m_pBucketsPool : moBucketsPool;
		//
    m_pData : MOubyte[] = [];

		m_Dirs : moTextArray;

  constructor( url?: any ) {
    super();

    this.SetCompletePath(url);
  }

  Init(): boolean {
    return super.Init();
  }

  SetCompletePath( p_completepath : moText ) : void {

	//check if http. ftp or other...set remote
    this.m_CompletePath = p_completepath;

/*
	moText Left8 = m_CompletePath;
	Left8.Left(8);
	moText Left7 = m_CompletePath;
	Left7.Left(7);
	moText Left6 = m_CompletePath;
	Left6.Left(6);
*/

    if (this.m_CompletePath.indexOf("http://") == 0) {
      this.m_Protocol = "http://";
      this.m_FileType = moFileType.MO_FILETYPE_HTTP;
      this.m_bRemote = true;
      this.m_bExists = false;
    } else if (this.m_CompletePath.indexOf("https://") == 0) {
      this.m_Protocol = "https://";
      this.m_FileType = moFileType.MO_FILETYPE_HTTPS;
      this.m_bRemote = true;
      this.m_bExists = false;
    } else if (this.m_CompletePath.indexOf("ftp://") == 0) {
      this.m_Protocol = "ftp://";
      this.m_FileType = moFileType.MO_FILETYPE_FTP;
      this.m_bRemote = true;
      this.m_bExists = false;
    } else {
        var FileNameA : moTextArray;
        this.m_Protocol = "file:///";

      //moText m_Drive = m_CompletePath.Scan(":");
      //std::string str;
      //str = bfs::extension( (char*)m_CompletePath );
      this.m_Extension = this.m_CompletePath.substring( this.m_CompletePath.lastIndexOf("."), this.m_CompletePath.length  );
      this.m_Path = "";
      var pathStart : moText = this.m_CompletePath;
      pathStart = pathStart.substr(0,1);
      //cout << "pathStart:" << pathStart << " slash:" << moSlash << endl;
          var T0 : moText0 = new moText0(this.m_CompletePath);
          this.m_Dirs = T0.Explode("/");
          if (this.m_CompletePath.length>0)
            if ( pathStart == moSlash )
              this.m_Path = moSlash;

          if ( this.m_Dirs.length > 0 ) {
              this.m_Drive = this.m_Dirs[0];
              this.m_FileName = this.m_Dirs[this.m_Dirs.length-1];
              FileNameA = new moText0( this.m_FileName ).Explode(".");
              this.m_FileName = FileNameA[0];
              //this.m_Dirs.Remove(m_Dirs.Count()-1);
              this.m_Dirs.pop();
          }

          for( var d=0; d < this.m_Dirs.length; d++ ) {
            if (""+this.m_Dirs[d]!="" && ""+this.m_Dirs[d]!="/" && ""+this.m_Dirs[d]!=".")// && m_Dirs[d]!="..")
              this.m_Path = "" + this.m_Path + this.m_Dirs[d] + moSlash;

          }

      this.m_FileType = moFileType.MO_FILETYPE_LOCAL;
      this.m_bRemote = false;

          this.m_CompletePath = "" + this.m_Path + this.m_FileName + this.m_Extension;
/*
      this.m_bExists = bfs::exists((char*)m_CompletePath);

          char *path;
          path = m_CompletePath;
          try {
              if ( Exists() && !bfs::is_directory(path)) m_FileSize = (long) bfs::file_size( path );
              else m_FileSize = 0;
          } catch( const bfs::filesystem_error& e ) {
              moDebugManager::Error("moFile::moFile > error: " + moText( e.what()) );
              m_FileSize = 0;
          }
  */
  	}
  }

  Exists(): boolean {
    return true;
  }

  GetPath() : moText {
	  return this.m_Path;
  }

  GetCompletePath() : moText {
	  return this.m_CompletePath;
  }

  GetAbsolutePath() : moText {
    var path : string;
    var absolutePath : moText = this.m_CompletePath;

    if (!this.m_bExists) {
      return this.m_CompletePath;
    }

    path = ""+this.m_CompletePath;
/*
    try {

      bfs::path abspath = bfs::canonical( path );
      absolutePath = (char*)abspath.string().c_str();

    } catch( const bfs::filesystem_error& e ) {

    }
  */
      return absolutePath;
  }

  GetExtension() : moText {
    return this.m_Extension;
  }

  GetFolderName() : moText {
    if (this.m_Dirs.length>0) {
      return this.m_Dirs[this.m_Dirs.length-1];
    }
    return "";
  }

};


export class moFileManager extends moResource {

  constructor(private http: Http) {
    super();
    this.SetName("_filemanager_");
  }

  Load( p_FileName : moText , bWaitForDownload : boolean=true, callback?:any ) {
    this.http.get(""+p_FileName).subscribe(res => {
      //console.log("moFileManager > Load > name: ", p_FileName );
      //this.m_pData = res.json():
      if (callback) callback(res);
    });
  }


};
