//import { Http, RequestOptions, Request, Headers } from "@angular/http";
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';

import { moAbstract } from "./mo-abstract";
import { moText, moText0, moTextArray } from "./mo-text";
import { NULL, MOlong, MOint, MOulong, MOuint, MOfloat, MOdouble, MOubyte } from "./mo-types";
import { moResource } from "./mo-resource";

export const FS : any = window["fs"];
export const EXEDIR = (window["__dirname"]==undefined)? "" : window["__dirname"];

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

    //just to check is not the ref object
    var str: string = "" + p_completepath;
    this.m_CompletePath = str;
    if (EXEDIR != "") {
      if (str.indexOf(EXEDIR) == 0) {
        //do nothing
      } else {
        this.m_CompletePath = "" + EXEDIR +moSlash+str;
      }
    }
    //console.log("this.m_CompletePath", this.m_CompletePath);
  /*  console.log("str", str);
    console.log("this.m_CompletePath", this.m_CompletePath);
    this.m_CompletePath = "" + EXEDIR;
    console.log("this.m_CompletePath", this.m_CompletePath);
    this.m_CompletePath = this.m_CompletePath + "/";
    console.log("this.m_CompletePath", this.m_CompletePath);
    this.m_CompletePath = this.m_CompletePath + "" + str;
    console.log("this.m_CompletePath", this.m_CompletePath);
*/
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
			this.m_Extension = this.m_CompletePath.substring(this.m_CompletePath.lastIndexOf("."), this.m_CompletePath.length);
			this.m_Path = "";
      var pathStart: moText = this.m_CompletePath;
      pathStart = pathStart.substr(0, 1);
      //cout << "pathStart:" << pathStart << " slash:" << moSlash << endl;
      var T0: moText0 = new moText0(this.m_CompletePath.substring( 8, this.m_CompletePath.length ));
      this.m_Dirs = T0.Explode("/");
      this.m_Path = this.m_Protocol;

      if (this.m_Dirs.length > 0) {
        this.m_Drive = this.m_Dirs[0];
        this.m_FileName = this.m_Dirs[this.m_Dirs.length - 1];
        FileNameA = new moText0(this.m_FileName).Explode(".");
        this.m_FileName = FileNameA[0];
        //this.m_Dirs.Remove(m_Dirs.Count()-1);
        this.m_Dirs.pop();
      }
			var slash : moText = "";
      for (var d = 0; d < this.m_Dirs.length; d++) {
        if ("" + this.m_Dirs[d] != "" && "" + this.m_Dirs[d] != "/" && "" + this.m_Dirs[d] != ".")// && m_Dirs[d]!="..")
				{
          this.m_Path = "" + this.m_Path + slash + this.m_Dirs[d];
					slash = moSlash;
				}
      }
			this.m_Path = ""+this.m_Path + slash;
    } else if (this.m_CompletePath.indexOf("ftp://") == 0) {
      this.m_Protocol = "ftp://";
      this.m_FileType = moFileType.MO_FILETYPE_FTP;
      this.m_bRemote = true;
      this.m_bExists = false;
    } else {
      var FileNameA: moTextArray;
      this.m_Protocol = "file://";
      //this.m_CompletePath = window["__dirname"]+"" + moSlash + this.m_CompletePath;
      //console.log("moFile opening > ", this.m_CompletePath);
      //moText m_Drive = m_CompletePath.Scan(":");
      //std::string str;
      //str = bfs::extension( (char*)m_CompletePath );
      this.m_Extension = this.m_CompletePath.substring(this.m_CompletePath.lastIndexOf("."), this.m_CompletePath.length);
      this.m_Path = "";
      var pathStart: moText = this.m_CompletePath;
      pathStart = pathStart.substr(0, 1);
      //cout << "pathStart:" << pathStart << " slash:" << moSlash << endl;
      var T0: moText0 = new moText0(this.m_CompletePath);
      this.m_Dirs = T0.Explode("/");
      if (this.m_CompletePath.length > 0)
        if (pathStart == moSlash)
          this.m_Path = moSlash;

      if (this.m_Dirs.length > 0) {
        this.m_Drive = this.m_Dirs[0];
        this.m_FileName = this.m_Dirs[this.m_Dirs.length - 1];
        FileNameA = new moText0(this.m_FileName).Explode(".");
        this.m_FileName = FileNameA[0];
        //this.m_Dirs.Remove(m_Dirs.Count()-1);
        this.m_Dirs.pop();
      }

      for (var d = 0; d < this.m_Dirs.length; d++) {
        if ("" + this.m_Dirs[d] != "" && "" + this.m_Dirs[d] != "/" && "" + this.m_Dirs[d] != ".")// && m_Dirs[d]!="..")
          this.m_Path = "" + this.m_Path + this.m_Dirs[d] + moSlash;

      }

      this.m_FileType = moFileType.MO_FILETYPE_LOCAL;
      this.m_bRemote = false;

      this.m_CompletePath = "" + this.m_Path + this.m_FileName + this.m_Extension;

      //console.log("moFile > ", this.m_CompletePath, this);

      if (FS == undefined) { this.m_bExists = true; return; }

      var stat = FS.statSync(this.m_CompletePath);
      //console.log("moFile:",stat);

      this.m_bExists = FS.existsSync(this.m_CompletePath);

      var path = this.m_CompletePath;
      try {
        if (this.Exists() && !stat.isDirectory())
          this.m_FileSize = stat["size"];
        else
          this.m_FileSize = 0;
      } catch (err) {
            this.MODebug2.Error("moFile::moFile > error: " + err);
            this.m_FileSize = 0;
      }

    }
  }

  Exists(): boolean {
    return this.m_bExists || this.m_bRemote;
  }

  GetType() : moFileType {
    return this.m_FileType;
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

    if (FS) {
      try {

        absolutePath = FS.realpathSync(path);

      } catch ( err ) {

      }
    }
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

  GetFileName() : moText {
    return this.m_FileName;
  }

  GetFullName() : moText {
	  return ( "" + this.m_FileName + this.m_Extension );
  }

};

export type moFileArray = moFile[];



export class moDirectory extends moAbstract {
  m_DirType : moFileType;
  m_DirStatus : moFileStatus;
  m_FileIndex : MOint;

  m_DirName : moText;
  m_DirNameArray : moTextArray;
  m_CompletePath : moText;
  m_Protocol : moText;

  m_bExists : boolean = false;
  m_bRemote : boolean = false;

  m_pFileManager : moFileManager;

  m_Files : moFileArray = [];
  m_SubDirs: moDirectoryArray = [];

  constructor(p_foldername?:moText, p_res?: moFileManager) {
    super();
    if (p_foldername) {
      this.Open( p_foldername, "" );
    }
  }


  Open(p_CompletePath: moText, p_Search: moText): boolean {

    var path: moText = "";
    var stdFileName: moText = "";
    var stdCompleteFileName: moText = "";
    //var set<string> stdListOfFileNames;
    //var set<string> stdListOfCompleteFileNames;

    this.m_CompletePath = p_CompletePath;
    path = this.m_CompletePath;

    //m_CompletePath = "\\\\\\";

    this.m_DirNameArray = new moText0(this.m_CompletePath).Explode("/");

    if (this.m_DirNameArray.length > 0) {
      this.m_DirName = this.m_DirNameArray[this.m_DirNameArray.length - 1];
    } else {
      this.m_DirName = this.m_CompletePath;
    }

    var CompletePathSearch: moText = p_CompletePath + "" + p_Search;

    /** Empty file array*/
    this.m_Files = [];

    /** Empty subdirs array*/
    this.m_SubDirs = [];

    if (FS == undefined) {
			console.error("moFileManager > moDirectory > Open could not work with folder:",CompletePathSearch);
			console.error("moFileManager > moDirectory > Open Not implemented in online mode. TODO: Implement based on standard web directory listings.");
			return (this.m_bExists = true);
		}

    /** Set by default m_bExists on false*/
    this.m_bExists = false;

    /** Check files*/
    var file_names = [];

    if( FS.existsSync( path ) )
    {
        this.m_bExists = true;
        var files = FS.readdirSync(path);
        var files_sort = {};
        for (var i = 0; i < files.length; i++) {
          var name = path + "" + moSlash + files[i];
          if (FS.statSync(name).isDirectory()){
            var pSubdir : moDirectory = new moDirectory( name );
            this.m_SubDirs.push( pSubdir );
          } else {
            // stdFileName
            // stdCompleteFileName
            // stdListOfFileNames
            // stdListOfCompleteFileNames
            //this.m_Files.push(name);
            file_names.push(name);
          }
        }

    }


    file_names.sort();
    for (var i = 0; i < file_names.length; i++) {
      var pFile: moFile = new moFile(file_names[i]);
      this.m_Files.push(pFile);
    }

    /** Sorted for linux */
    /*
    moText pCompletePathFilename;

    for (std::set<string>::iterator Name = stdListOfCompleteFileNames.begin() ; Name != stdListOfCompleteFileNames.end(); ++Name)
    {
      //cout << *Name << endl;
      string comp = *Name;
      pCompletePathFilename = moText((char *)comp.c_str());

      moFile * pFile = NULL;
      if (m_pFileManager)
        pFile = m_pFileManager ->GetFile(pCompletePathFilename);
      else
        pFile = new moFile(pCompletePathFilename);

      if (pFile) m_Files.Add(pFile);
  }*/

    return this.m_bExists;

  }


  Exists() : boolean {
      //this.m_bExists = bfs::exists((char*)this.m_CompletePath);
    return this.m_bExists;
  }


  HasSubdirs() : boolean {
    return (this.m_SubDirs.length>0);
  }

  IsRemote() : boolean {
    return this.m_bRemote;
  }

  GetCompletePath() : moText {
    return this.m_CompletePath;
  }

  GetDirName() : moText {
    return this.m_DirName;
  }

  GetType() : moFileType {
    return this.m_DirType;
  }

  GetProtocol() : moText {
    return this.m_Protocol;
  }



  GetStatus() : moFileStatus {
    return this.m_DirStatus;
  }

  FindFirst() : moFile {
    if (this.m_bExists) {
      if (this.m_Files.length>0) {
        this.m_FileIndex = 0;
        return this.m_Files[0];
      }
    }
    return NULL;
  }

  FindNext() : moFile {
    if (this.m_bExists) {
      if (this.m_Files.length>0) {
        if ( (this.m_FileIndex+1) < this.m_Files.length ) {
          this.m_FileIndex++;
          return this.m_Files[this.m_FileIndex];
        } else {
          this.m_FileIndex--;
          return NULL;
        }
      }
    }
    return NULL;
  }

  FindLast() : moFile {
    if (this.m_bExists) {
      if (this.m_Files.length>0) {
        this.m_FileIndex = this.m_Files.length - 1;
        return this.m_Files[this.m_FileIndex];
      }
    }
    return NULL;
  }

  Find( filename : any ) : moFile {
    if (this.m_bExists) {
      if (typeof filename == "number") {
        return this.m_Files[Number(filename)];
      }
      for(this.m_FileIndex=0; this.m_FileIndex< this.m_Files.length; this.m_FileIndex++) {
        if (this.m_Files[this.m_FileIndex].GetFileName()==filename)
          return this.m_Files[this.m_FileIndex];
      }
    }
    return NULL;
  }

	Update() : void {



//    void show_files( const path & directory, bool recurse_into_subdirs = true )
//    {
    /** Check files*/
    /*
    char *path;

	path = m_CompletePath;
      if( bfs::exists( path ) )
      {
          m_bExists = true;

         bfs::directory_iterator end ;
        for(  bfs::directory_iterator iter(path) ; iter != end ; ++iter )
          if (  bfs::is_directory( *iter ) )
          {
            //cout << iter->native_directory_string() << " (directory)\n" ;
            //if( recurse_into_subdirs ) show_files(*iter) ;
          } else {
            //cout << iter->native_file_string() << " (file)\n" ;

            //ATENCION SEGUN LA VERSION DE BOOST hya que usar filename() o leaf()

                #if BOOST_VERSION < 104300
                    moText pFileName( iter->path().leaf().c_str() );
                    moText pCompletePathFilename( iter->path().string().c_str() );
                #else
                    moText pFileName( iter->path().filename().string().c_str() );
                    moText pCompletePathFilename( iter->path().string().c_str() );
                #endif




            moFile*	pFile = NULL;

            if (pFileName!=moText("Thumbs.db")) {

                bool founded = false;

                for( int i=0; i<(int)m_Files.Count(); i++) {
                    pFile = m_Files[i];
                    if  (pFile->GetCompletePath()==pCompletePathFilename) {
                        founded = true;
                    }
                }
                if (!founded) {
                        if (m_pFileManager) {
                            pFile = m_pFileManager->GetFile( pCompletePathFilename );
                        } else {
                            pFile = new moFile( pCompletePathFilename );
                        }
                        if (pFile) {
                            MODebug2->Message( moText("moFileManager::moDirectory::Update file added:") + (moText)pCompletePathFilename);
                            m_Files.Add(pFile);
                        }
                }

            }


            //#ifdef _DEBUG
            //MODebug2->Message( moText("moFileManager:: moDirectory::Update:") + (moText)pCompletePathFilename);
            //#endif
            //printf("%-32s %s %9.ld %s",fileInfo.name, attribs, fileInfo.size , timeBuff);

          }

      }
*/
      return;

	}



  GetFiles() : moFileArray {
    return this.m_Files;
  }

  GetSubDirs() : moDirectoryArray {
    return this.m_SubDirs;
  }

}

export type moDirectoryArray = moDirectory[];

const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin':'*',
}) };

export class moFileManager extends moResource {
  m_Files : moFileArray = [];
  m_Directories : moDirectoryArray = [];

  constructor(private http: HttpClient) {
    super();
    this.SetName("_filemanager_");
    console.log("dirname:",window["__dirname"]);
  }

  Load( p_FileName : moText , bWaitForDownload : boolean=true, callback?:any ) {
		console.log("window.location.protocol",window.location.protocol);
		console.log("window.location.host",window.location.host);
		console.log("p_FileName",p_FileName);
		var fullget : string = window.location.protocol+"//"+window.location.host;
		var fullpath : string = "/"+p_FileName;
		console.log("fullpath before:",fullpath);
		fullpath = fullpath.replace("./","");
		console.log("fullget",fullget);
		console.log("fullpath",fullpath);
		fullget = fullget + fullpath;
		console.log("Loading url with http get and subscribe:",fullget);
		try {
    	this.http.get(  fullget, {responseType: 'text'} ).subscribe(
				res => {
      		//console.log("moFileManager > Load > name: ", p_FileName );
					console.log(res);
      		//this.m_pData = res.json():
      		if (callback) callback(res);
    		},
        error => console.log('oops', error)
			);
		} catch(error) {
			console.log("Error:",error);
		}
  }

  Open(p_Path: moText, bWaitForDownload: boolean = true) {

    for (var i = 0; i < this.m_Directories.length; i++) {
      if (this.m_Directories[i].GetCompletePath() == p_Path) {
        return true;
      }
    }

    var pDir: moDirectory = new moDirectory(p_Path, this);
    console.log("Opened Dir:", pDir);
    if (pDir) {
      if (pDir.GetType() == moFileType.MO_FILETYPE_LOCAL
        && pDir.Exists() == false) {
        //delete pDir;
        return false;
      }
      /*if (this.bWaitForDownload && pDir.IsRemote()) {
        while (pDir.GetStatus() != moFileStatus.MO_FILESTATUS_READY) {
          pDir.Update();
        }
      }*/
      this.m_Directories.push(pDir);
      return true;
    }
    return false;
  }

  GetDirectory( p_Path : moText ): moDirectory {
    if ( this.Open(p_Path) ) {
      for(var i = 0; i< this.m_Directories.length; i++ ) {
        if ( this.m_Directories[i].GetCompletePath() == p_Path ) {
          return this.m_Directories[i];
        }
      }
    }
  }

  GetFile(p_filename: moText): moFile {
    return new moFile(p_filename);
  }



}
