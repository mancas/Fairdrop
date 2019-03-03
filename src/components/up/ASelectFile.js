import React, { Component } from 'react';
import Dropzone from 'dropzone';
import DDrop from '../../lib/DDrop';
import App from '../../App';

class ASelectFile extends Component{
  
  constructor(props) {
    super(props);
    this.state = { 
      dragEnterStore: false,
      dragEnterSend: false,
      hasDropped: false 
    }
    this.handleClickSelectFile = this.handleClickSelectFile.bind(this);
    this.handleClickStoreFile = this.handleClickStoreFile.bind(this);
    this.handleClickQuickFile = this.handleClickQuickFile.bind(this);
  }

  componentDidMount(){
    App.aSelectFile = this;
    this.dropZone();

    if(this.props.isSendingFile){
      this.handleClickSelectFile();
    }else 
    if(this.props.isStoringFile){
      this.handleClickStoreFile();
    }else 
    if(this.props.isQuickFile){
      this.handleClickQuickFile();
    }
  }

  initDropzone(element, isStoring=false, isQuick=false){
    let dd = new DDrop(); 
    this.dropzone = new Dropzone(element, { 
      url: 'dummy://', //dropzone requires a url even if we're not using it
      previewsContainer: false,
      // clickable: false,
      accept: (file, done) => {
        var reader = new FileReader();
        reader.addEventListener("loadend", 
          function(event) { 
            // for now, todo -> streams...
            window.selectedFileArrayBuffer = event.target.result;
          });
        reader.readAsArrayBuffer(file);
      }
    });

    this.dropzone.on("dragenter", (event) => {
      this.props.setParentState({fileIsSelecting: true});
      if(isStoring){
        this.setState({dragEnterStore: true});
      }else{
        this.setState({dragEnterSend: true});
      }
    });

    this.dropzone.on("dragleave", (event) => {
      if(isStoring){
        this.setState({dragEnterStore: false});
      }else{
        this.setState({dragEnterSend: false});
      }
      if(event.fromElement === null){
        this.props.setParentState({fileIsSelecting: false});
      }
    });

    this.dropzone.on("drop", (event) => {
      
      this.setState({ hasDropped: true });
      this.props.fileWasSelected(true);
      if(isStoring === true){
        this.props.setParentState({isStoringFile: true});
      }else 
      if(isQuick === true){
        this.props.setParentState({isQuickFile: true});
      }else
      {
        this.props.setParentState({isSendingFile: true});        
      }

      setTimeout(()=>{
        dd.drop('drop', event.clientX, event.clientY);
      }, 233);
    })

    this.dropzone.on("addedfile", (file) => {
      if(file.size > (1024 * 1024 * 5)){
        alert('Sorry, proof of concept is restricted to 5mb');
        return false;
      }

      // solves the problem that there is no event to capture 'cancel' by doing the animation after
      var animationTimeout = 0;
      if(this.state.isHandlingClick === true){
        animationTimeout =  200;
        this.props.setParentState({fileIsSelecting: true});
      }else{
        animationTimeout =  0;
      }
      setTimeout(()=>{

        this.props.fileWasSelected(true);    
        if(this.state.hasDropped === false){
          this.setState({ hasDropped: true });
          dd.drop('drop');
        }
        
        let newUIState;

        if(this.props.parentState.isStoringFile === true){
          //skip sign in if signed in
          if(this.props.selectedMailbox === false){
            newUIState = 1;
          }else{
            newUIState = 3;
          }
        }if(this.props.parentState.isQuickFile === true){
          //skip sign in regardless
          newUIState = 3;
        }if(this.props.parentState.isSendingFile === true){
          //select recipient
          newUIState = 1;
        }

        setTimeout(()=>{
          this.props.setParentState({
            fileIsSelected: true,
            selectedFileName: file.name,  
            selectedFileType: file.type,        
            selectedFileSize: file.size,
            uiState: newUIState
          });
        }, 1555);

      }, animationTimeout);
    });    
  }

  dropZone(){
    this.initDropzone(this.refs.dtSelectSaveFile);
    this.initDropzone(this.refs.dtSelectStoreFile, true);    
    this.initDropzone(this.refs.dtSelectQuickFile, false, true);        
  }

  handleClickQuickFile(e){
    if(e){
      e.preventDefault();
    }
    this.props.setParentState({
      isQuickFile: true,
    });    
    this.setState({'isHandlingClick': true});
    this.refs.dtSelectSaveFile.click();
  }

  handleClickSelectFile(e){
    if(e){
      e.preventDefault();
    }
    this.props.setParentState({
      isSendingFile: true,
    });        
    this.setState({'isHandlingClick': true});
    this.refs.dtSelectSaveFile.click();
  }

  handleClickStoreFile(e){
    if(e){
      e.preventDefault();
    }
    this.props.setParentState({
      isStoringFile: true,
    });
    this.setState({'isHandlingClick': true});
    this.refs.dtSelectStoreFile.click();
  }

  render(){
    return (
      <div id="select-file" className={"select-file " + (this.props.parentState.fileIsSelected && "is-selected " + (this.props.parentState.uiState !== 1 ? "hidden" : "fade-in"))} >
        <div className={"select-file-main drop " + (this.props.parentState.fileIsSelecting && "is-selecting ") + (this.state.hasDropped && "has-dropped")} > {/* this bit expands to fill the viewport */}
          <div ref="dtSelectStoreFile" className="select-file-store" style={{display: 'none'}}>
            <div className="select-file-drop-inner">
              <h2>Store encrypted</h2>
              <div>Requires logging in to your mailbox</div>
            </div>
          </div>
          <div ref="dtSelectSaveFile" className="select-file-send">
            <div className="select-file-drop-inner">
              <h2>Send encrypted</h2>
              <div>Requires logging in to your mailbox</div>
            </div>
          </div>
          <div ref="dtSelectQuickFile" className="select-file-quick">
            <div className="select-file-drop-inner">
              <h2>Send in a quick way</h2>
              <div>Send unencrypted - no mailboxes required</div>
            </div>
          </div>
        </div>
        <div className={"select-file-instruction " + (this.props.parentState.fileIsSelecting && "is-selecting ") + (this.state.hasDropped && "has-dropped")}> {/* this bit is centered vertically in the surrounding div which overlays the other two siblings */}
          <div className="select-file-instruction-inner">
            <h2>
              Fair way to store and send data in <br/> the <span ref="retype-age">age of Anthropocene</span>
            </h2>
            <h3>
              <img src="assets/images/fairdrop-select.svg"/> <span className="select-file-action" onClick={this.handleClickSelectFile}>select</span> or <img src="assets/images/fairdrop-drop.svg"/> drop a file
            </h3>
          </div>
        </div>
      </div>
    )
  }
}

export default ASelectFile;