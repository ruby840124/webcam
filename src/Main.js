import React from "react"
import defaultPicture from './image/cat.jpg';
class Main extends React.Component {
	constructor(props) {
        super(props);
        this.state={
        wecamDisplay:"inline",
        screenDisplay:"none",
        filter:"sepia",
        isToggleOn:true,
        herf:"",
        width:800,
        height:500,
        scaleWidth:0,
        scaleHeight:0,
        }
    }

    //component被render到DOM之後才會執行
    componentDidMount(){
        this.webcam();
        this.timerID = setInterval(
            () => this.webcamToCanvas(),
            100
          );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    //網路攝影機
    webcam() {
        let inputVideo = document.querySelector('#video');
        let filter1 = document.querySelector('#filter1');
        let filter2 = document.querySelector('#filter2');
        let filter3 = document.querySelector('#filter3');
        let constraints = {
            video: {width:this.state.width, height:this.state.height}
        }
         // 請求開啟影音裝置
         navigator.mediaDevices.getUserMedia(constraints)
         .then(function (stream) {
            window.stream = stream; 
            inputVideo.srcObject = stream;
            filter1.srcObject = stream;
            filter2.srcObject = stream;
            filter3.srcObject = stream;
         })
         .catch(function (error) {
        //錯誤訊息
            if (error.name === 'ConstraintNotSatisfiedError') {
                alert('The resolution ' + constraints.video.width.exact + 'x' +
                    constraints.video.width.exact + ' px is not supported by your device.');
              } else if (error.name === 'PermissionDeniedError') {
                alert('Permissions have not been granted to use your camera and ' +
                  'microphone, you need to allow the page access to your devices in ' +
                  'order for the demo to work.');
              }
                alert('getUserMedia error: ' + error.name, error);
         });
    }

    //將攝影鏡頭轉到canvas上
    webcamToCanvas(){
        if(this.state.isToggleOn==true){
            const video = document.querySelector('#video');
            const canvas = document.querySelector('#webcamCanvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video,this.state.scaleWidth,this.state.scaleHeight,this.state.width,this.state.height);
        }
    }


    //處理螢幕截圖的按鈕
    handleScreenShot=event=> {
        this.setState(prevState => ({isToggleOn:!prevState.isToggleOn}));
        if(this.state.isToggleOn==true){
            this.setState(({wecamDisplay:"none",screenDisplay:"inline"}));  
        }else{
            this.setState(({wecamDisplay:"inline",screenDisplay:"none"}));  
        }

    }

    //儲存圖片的按鈕
    handleSave=event=> {
        var mycanvas = document.getElementById("webcamCanvas");
        var image = mycanvas.toDataURL("image/jpg");
        this.setState({href:image});
    }

    //放大按鈕
    handleZoomIn=event=> {
        const scaleWidth=this.state.scaleWidth-(this.state.width*1.2-this.state.width)/2;
        const scaleHeight=this.state.scaleHeight-(this.state.height*1.2-this.state.height)/2;
        let width = this.state.width;
        width = width*1.2;
        let height = this.state.height;
        height = height*1.2;
        this.setState({width:width,height:height,scaleWidth:scaleWidth,scaleHeight:scaleHeight});

    }

    //縮小按鈕
    handleZoomOut=event=> {
        const scaleWidth=this.state.scaleWidth+(this.state.width-this.state.width/2)/2;
        const scaleHeight=this.state.scaleHeight+(this.state.height-this.state.height/2)/2;
        let width = this.state.width;
        width = width/2;
        let height = this.state.height;
        height = height/2;
        this.setState({width:width,height:height,scaleWidth:scaleWidth,scaleHeight:scaleHeight});
    }


    render() {
        let text = null;
        (this.state.isToggleOn?text="webcam":text="screenShot");
        let buttonText = null;
        (this.state.isToggleOn?buttonText="screenShot":buttonText="webcam");
        const filterStyle=["grayfilter","sepia","blur","invert"];
        return (
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                <div>
                    <canvas id="webcamCanvas"></canvas>
                    <video  style={{display:"none"}} id="video" autoPlay>
                            Your browser does not support HTML5 video.
                    </video>
                    <h1 style={{textAlign:"center",fontFamily:"ProximaNova-Bold"}}>{text}</h1>
                </div>
                <div style={{display:"flex"}}>
                    <button className="buttonStyle" onClick={this.handleScreenShot}>{buttonText}</button>
                    <a id="download" download="screenshot.jpg" href={this.state.href} style={{display:this.state.screenDisplay}}><button onClick={this.handleSave}>Save</button></a>
                    <button className="buttonStyle" onClick={this.handleZoomIn}  style={{display:this.state.wecamDisplay}}>zoom in</button>
                    <button className="buttonStyle" onClick={this.handleZoomOut} style={{display:this.state.wecamDisplay}}>zoom out</button>
                </div>
                <div style={{display:"flex"}}>
                    <h1 style={{textAlign:"center"}}>grayfilter</h1>
                    <video className={filterStyle[0]} id="filter1" style={{display:this.state.wecamDisplay}} autoPlay></video>
                    <video className={filterStyle[1]} id="filter2" style={{display:this.state.wecamDisplay}} autoPlay></video>
                    <video className={filterStyle[2]} id="filter3" style={{display:this.state.wecamDisplay}} autoPlay></video>
                </div>

            </div>
        )
    }
}

export default Main;
