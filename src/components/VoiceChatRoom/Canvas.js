import React, { useRef } from 'react';
import Sketch from 'react-p5';

const Canvas = ({ ...props }) => {
  const { socket, name } = props

  const gUser = useRef({});
  const others = useRef(new Map());
  const clicked = useRef(false);
  const scaleFactor = useRef(1);
  let myp5;

  class Avatar {
    constructor(p5, uname, x, y, sid = '') {
      this.x = x;
      this.y = x;
      this.r = 50;
      this.uname = uname;
      this.sid = sid;
      this.c = p5.color(63, 81, 181);
    }

    unique_color() {
      this.c = myp5.color(100, 100, 181);
    }

    render() {
      myp5.fill(this.c);
      myp5.ellipse(this.x, this.y, 2 * this.r, 2 * this.r);

      myp5.fill(255);
      myp5.textSize(20);
      myp5.textAlign(myp5.CENTER, myp5.CENTER);
      myp5.text(this.uname, this.x - this.r, this.y - this.r, this.r * 2, this.r * 2);
    }
  }



  const setup = (p5, canvasParentRef) => {
    // use parent to render the canvas in this ref
    // (without that p5 will render the canvas outside of your component)

    let cvn = p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
    myp5 = p5;
    p5.noStroke();
    gUser.current = new Avatar(p5, name, p5.windowWidth / 2, p5.windowHeight / 2);
    gUser.current.unique_color();
    console.log(`${JSON.stringify(gUser.current)}`)


    socket.emit('new user', { uname: name, x: gUser.current.x, y: gUser.current.y });
    socket.on('user set', (msg) => {
      // console.log(`ENTERED USER SET ${JSON.stringify(msg)}`)

      for (let u of Object.values(msg)) {
        if (u.uname !== name) others.current.set(u.sid, new Avatar(p5, u.uname, u.x, u.y, u.sid));
        else gUser.current.sid = u.sid;
      }
    })

    socket.on('room update', (msg) => {
      // console.log(`ENTERED ROOM UPDATE ${JSON.stringify(msg)}`)

      if (msg.uname !== name && others.current.has(msg.sid)) {
        others.current.get(msg.sid).x = msg.x;
        others.current.get(msg.sid).y = msg.y;


        //Distance calculation (Radius)
        var gx = gUser.current.x,
            gy = gUser.current.y,
            px = msg.x,
            py = msg.y,
            pr = others.current.get(msg.sid).r;
        var distance = Math.sqrt(((px - gx) * (px - gx)) + ((py - gy) * (py - gy)));


        socket.emit('updated distance', {'name': others.current.get(msg.sid).uname, 'distance': distance, 'sid': msg.sid, 'from': socket.id});
        //For debug, changes name of otehr user who moved to
        //the distance compared to main user
        // others.current.get(msg.sid).uname = `${distance.toFixed(2)}`;


        // Radious of moving user decreases as it gets farther away (Commented for now)
        // if(distance > 100) {
        //   var newR = 50 - .25*(distance-100);

        //   if(newR > 1) {
        //     others.current.get(msg.sid).c = p5.color(63, 81, 181);
        //     others.current.get(msg.sid).r = newR;
        //   }

        //   // When radious is below 1, user becomes a "ghost"
        //   else {
        //     others.current.get(msg.sid).c = p5.color(63, 81, 181, 105);
        //     others.current.get(msg.sid).r = 50;
        //   }
        // }
      }

    })

    socket.on('user disconnect', (msg) => {
      console.log(`USER DISCONNECTED ${JSON.stringify(msg)}`)

      others.current.delete(msg);
    })

    // socket.on('remove sid', (msg) => {
    //   console.log(`ENTERED REMOVE SID ${JSON.stringify(msg)}`);
    //   others.current.delete(msg.sid);
    // })

    cvn.mousePressed(mousePressed);
    cvn.mouseReleased(mouseReleased);
    cvn.mouseWheel(mouseWheel);
  };

  function mousePressed() {
    let mx = myp5.mouseX / scaleFactor.current;
    let my = myp5.mouseY / scaleFactor.current;

    if (Math.sqrt((mx - gUser.current.x) ** 2 + (my - gUser.current.y) ** 2) < gUser.current.r) {
      clicked.current = true;
    }
  }

  function mouseReleased() {
    clicked.current = false;
  }

  function mouseWheel(event) {
    if(event.deltaY > 0) {
      scaleFactor.current *= 1.1;
    }
    else if (event.deltaY < 0) {
      scaleFactor.current *= 0.9;
    }
    console.log(scaleFactor.current)
  }

  const draw = (p5) => {
    p5.push();
    p5.background(100);
    p5.scale(scaleFactor.current);
    let mx = p5.mouseX / scaleFactor.current;
    let my = p5.mouseY / scaleFactor.current;

    //bounds checking
    if (clicked.current) {
      gUser.current.x = mx;
      gUser.current.y = my;

      socket.emit('room update', { uname: name, x: gUser.current.x, y: gUser.current.y, sid: gUser.current.sid})
    }

    if (gUser.current) {
      gUser.current.render();
    }

    for (const u of others.current.values()) {
      u.render();
    }

    // NOTE: Do not use setState in the draw function or in functions that are executed
    // in the draw function...
    // please use normal variables or class properties for these purposes

    p5.pop();
  };

  function windowResized (p5) {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  }

  return (
    <Sketch setup={setup} draw={draw} windowResized={windowResized}/>
  )
}

export default Canvas;