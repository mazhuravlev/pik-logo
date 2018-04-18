function ThreeJSCanvas(CANVAS_ID) {
  
    var SCREEN_HEIGHT = Math.min(window.innerWidth, window.innerHeight);
    var SCREEN_WIDTH = SCREEN_HEIGHT;
    var SCREEN_ASPECT_RATIO = SCREEN_WIDTH / SCREEN_HEIGHT;
    var canvas, container;

    var container, loader, stats;
    var renderer, camera, scene;
    var raycaster, controls;

    var ANIMATION_FRAME_LENGTH = 30,
        INTERACT_DISTANCE = 2.5;
    var objetArray = [],
        animationQueue = [];

    var color1 = [255 , 0, 0].map(x => x/255),
        color2 = [0 , 0, 255].map(x => x/255);

    var bitmap = [];
    var BITMAP_SKIP = 1;

    var fov = 90;
    var cameraPos = [0, 0, 30];
    var cameraLookAt = [0, 0, 0];
    var viewHeight = 2 * Math.tan(THREE.Math.degToRad(fov / 2)) * cameraPos[2],
        viewWidth = viewHeight * SCREEN_ASPECT_RATIO;
    var mouse = new THREE.Vector3(10000, 10000, -1),
        mouseScaled = new THREE.Vector3(10000, 10000, -1);

    var frame = 0;

    function isMobile() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
      };

    function init() {

        // Global Variables
        container = document.getElementById("canvas-container-" + CANVAS_ID);
        canvas = document.getElementById("canvas-" + CANVAS_ID);
        canvas.addEventListener('mousemove', onDocumentMouseMove, false);
        canvas.addEventListener('touchmove', onDocumentMouseMove, false);

        loader = new THREE.JSONLoader();
       // stats = new Stats();
       // stats.domElement.classList.add("canvas-stats");
       // stats.domElement.id = "canvas-stats-" + CANVAS_ID;

        /* If you are familiar with python and opencv
           you can use this python script to generate custom bitmaps 
           --------------------
           https://git.io/vdBAu 
           --------------------
        */
        var data = '#0000000000000000000110000000000000000000'+
'#0000000000000000111111110000000000000000'+
'#0000000000000011111111111100000000000000'+
'#0000000000001111111111111111000000000000'+
'#0000000001111111111001111111111000000000'+
'#0000000111111111100000011111111110000000'+
'#0000011111111110000000000111111111100000'+
'#0011111111110000000000000000111111111100'+
'#1111111111000000000000000000001111111111'+
'#1111111100000000000000000000000011111111'+
'#1111100000000000000000000000000000011111'+
'#1110000000000000000000000000000000000111'+
'#1000000000000000000000000000000000000001'+
'#0000000000000000000000000000000000000000'+
'#1111111111110111100000111101111000001110'+
'#1111111111110111100001111101111000011110'+
'#1111111111110111100001111101111000111100'+
'#1111111111110111100011111101111001111000'+
'#1111000011110111100111111101111011111000'+
'#1111000011110111100111111101111111110000'+
'#1111000011110111101111111101111111100000'+
'#1111000011110111101110111101111111100000'+
'#1111000011110111111110111101111111110000'+
'#1111000011110111111100111101111011110000'+
'#1111000011110111111000111101111001111000'+
'#1111000011110111111000111101111001111100'+
'#1111000011110111110000111101111000111110'+
'#1111000011110111110000111101111000011111'+
'#0000000000000000000000000000000000000000'+
'#0000000000000000000000000000000000000000'+
'#1111111111111111111111111111111111111111'+
'#1111111111111111111111111111111111111111'+
'#1111111111111111111111111111111111111111'+
'#1100000000000001101000000100000110001111'+
'#1100111001100101001001100101100110001111'+
'#1100111000000100011001100101100110100111'+
'#1100111000001110011001100101100100100111'+
'#1100111001111100011001100101100100000111'+
'#1100111001111100111001100101100101110011'+
'#1111111111111111111111111111111111111111'+
'#1111111111111111111111111111111111111111'

;
      
                for (var i = 0; i < data.length; i++) {
                    if (data[i] == '#') {
                        bitmap.push([]);
                    }
                    else {
                        bitmap[bitmap.length - 1].push(data[i] - '0');
                    }
                }

//        container.appendChild(stats.domElement);

        // Renderer
        renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            canvas: canvas,
        });
        renderer.setClearColor(0xffffff, 0);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

        // Camera and Controls
        camera = new THREE.PerspectiveCamera(fov, SCREEN_ASPECT_RATIO, 0.1, 1000);
        // camera = new THREE.OrthographicCamera(-viewWidth, viewWidth, viewHeight, -viewHeight, 1, 300);
        camera.position.set(cameraPos[0], cameraPos[1], cameraPos[2]);
        camera.lookAt(new THREE.Vector3(cameraLookAt[0], cameraLookAt[1], cameraLookAt[2]));
        raycaster = new THREE.Raycaster();

        // controls = new THREE.OrbitControls(camera);
        // controls.rotateSpeed = 2.0;
        // controls.zoomSpeed = 2.0;
        // controls.enableZoom = true;
        // controls.enablePan = true;
        // controls.dampingFactor = 0.2;
        // controls.addEventListener('change', render);

        //Scene
        scene = new THREE.Scene();
      scene.background = new THREE.Color( 0xffffff );

        //Lights

        // Making Object Array
        var xOffset = -bitmap[0].length / (BITMAP_SKIP * 2);
        var yOffset = bitmap.length / (BITMAP_SKIP * 2);
        for (var i = 0; i < bitmap.length; i += BITMAP_SKIP) {
            for (var j = 0; j < bitmap[i].length; j += BITMAP_SKIP) {
                if (bitmap[i][j] == 1) {
                    planeGeometry = new THREE.PlaneGeometry(1, 1);
                    var circleGeometry = new THREE.CircleGeometry(1, 5);
                    var frac = i / bitmap.length;
                    // Materials
                    planeMaterial = new THREE.MeshBasicMaterial({
                        color: (i < 30) ? new THREE.Color(0,35/255,98/255) : new THREE.Color(232/255,32/255,0),
                        transparent: false,
                        //opacity: THREE.Math.randFloat(0.4, 0.6),
                        side: THREE.DoubleSide
                    });

                    var circleMaterial = new THREE.MeshBasicMaterial({
                        color: new THREE.Color(1, 1, 1),
                        transparent: true,
                        opacity: THREE.Math.randFloat(0.8, 1),
                        side: THREE.DoubleSide
                    });

                    // Mesh
                    planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
                    planeMesh.position.set(xOffset + j / BITMAP_SKIP, yOffset - i / BITMAP_SKIP, 0);
                    var randWidth = THREE.Math.randFloat(0.6, 1.2);
                    var randHeight = randWidth
                    planeMesh.scale.set(randWidth, randHeight, 1);
                    scene.add(planeMesh);
                    objetArray.push([planeMesh, false]);

if(!isMobile()) {
                    circleMesh = new THREE.Mesh(circleGeometry, circleMaterial);
                    circleMesh.position.set(xOffset + j / BITMAP_SKIP + THREE.Math.randFloat(-0.5, 0.5), yOffset - i / BITMAP_SKIP + THREE.Math.randFloat(-0.5, 0.5), 0.1);
                    var randRadius = THREE.Math.randFloat(0.05, 0.1);
                    circleMesh.scale.set(randRadius, randRadius, 1);
                    scene.add(circleMesh);
                    objetArray.push([circleMesh, false]);
                }
                }

            }
        }


        //Geometry 

        // Materials


        // Mesh


        // Helpers

        //Add Stuff to Scene


    }

    function animate() {

        requestAnimationFrame(animate);
        render();
//        stats.update();
        // controls.update();
        frame++;
    }

    function render() {
        
            while (animationQueue.length > 0) {
                var obj_index = animationQueue[0][0];
                var ani_frame = animationQueue[0][1];
                if (ani_frame > ANIMATION_FRAME_LENGTH) {
                    objetArray[obj_index][1] = false;
                    animationQueue.shift();
                }
                else {
                    break;
                }
            }

            for (var i = 0; i < objetArray.length; i++) {
                var obj = objetArray[i][0];
                var isAnimating = objetArray[i][1];
                if (isAnimating == false) {
                    var px = obj.position.x;
                    var py = obj.position.y;
                    var dist = Math.sqrt(Math.pow(px - mouseScaled.x, 2) + Math.pow(py - mouseScaled.y, 2));
                    if (dist < INTERACT_DISTANCE) {
                        var startPosVector = obj.position.clone();
                        var mouseRepelVector = new THREE.Vector3().subVectors(startPosVector, mouseScaled).multiplyScalar(THREE.Math.randFloat(INTERACT_DISTANCE + 0.5, INTERACT_DISTANCE + 2) - dist);
                        var endPosVector = new THREE.Vector3().addVectors(startPosVector, mouseRepelVector);
                        animationQueue.push([i, 0, startPosVector, endPosVector]);
                        objetArray[i][1] = true;
                    }
                }
            }

            for (var i = 0; i < animationQueue.length; i++) {
                var obj = objetArray[animationQueue[i][0]][0];
                var ani_frame = animationQueue[i][1];
                var startPosVector = animationQueue[i][2];
                var endPosVector = animationQueue[i][3];
                var curPosVector = new THREE.Vector3();
                var frac = 1 - Math.abs(ani_frame - (ANIMATION_FRAME_LENGTH / 2)) / (ANIMATION_FRAME_LENGTH / 2);
                frac = easeOutQuad(frac);
                curPosVector.lerpVectors(startPosVector, endPosVector, frac);

                obj.position.x = curPosVector.x;
                obj.position.y = curPosVector.y;
                obj.position.z = curPosVector.z;
                animationQueue[i][1] += 1;
            }

            mouse = new THREE.Vector3(10000, 10000, -2);
            mouseScaled = new THREE.Vector3(10000, 10000, -2);

            renderer.render(scene, camera);
    }

    function onWindowResize() {
        SCREEN_HEIGHT = Math.min(window.innerWidth, window.innerHeight);
        SCREEN_WIDTH = SCREEN_HEIGHT;
        SCREEN_ASPECT_RATIO = SCREEN_WIDTH / SCREEN_HEIGHT;
        camera.aspect = SCREEN_ASPECT_RATIO;
        camera.updateProjectionMatrix();
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        console.log(SCREEN_WIDTH + "x" + SCREEN_HEIGHT)
    }

    function onDocumentMouseMove(event) {
        let clientX = event.clientX;
        let clientY =event.clientY;

        if(event instanceof TouchEvent) {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        }

        var rect = canvas.getBoundingClientRect();

        mouse.x = clientX - rect.left;
        mouse.y = clientY - rect.top;

        mouseScaled.x = mouse.x * viewWidth / SCREEN_WIDTH - viewWidth / 2;
        mouseScaled.y = -mouse.y * viewHeight / SCREEN_HEIGHT + viewHeight / 2;

    }

    function sigmoid(t) {
        return 1 / (1 + Math.pow(Math.E, -t));
    }

    // no easing, no acceleration
    function linear(t) {
        return t;
    }
    // accelerating from zero velocity
    function easeInQuad(t) {
        return t * t;
    }
    // decelerating to zero velocity
    function easeOutQuad(t) {
        return t * (2 - t);
    }
    // acceleration until halfway, then deceleration
    function easeInOutQuad(t) {
        return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
    // accelerating from zero velocity 
    function easeInCubic(t) {
        return t * t * t;
    }
    // decelerating to zero velocity 
    function easeOutCubic(t) {
        return (--t) * t * t + 1;
    }
    // acceleration until halfway, then deceleration 
    function easeInOutCubic(t) {
        return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }
    // accelerating from zero velocity 
    function easeInQuart(t) {
        return t * t * t * t;
    }
    // decelerating to zero velocity 
    function easeOutQuart(t) {
        return 1 - (--t) * t * t * t;
    }
    // acceleration until halfway, then deceleration
    function easeInOutQuart(t) {
        return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
    }
    // accelerating from zero velocity
    function easeInQuint(t) {
        return t * t * t * t * t;
    }
    // decelerating to zero velocity
    function easeOutQuint(t) {
        return 1 + (--t) * t * t * t * t;
    }
    // acceleration until halfway, then deceleration 
    function easeInOutQuint(t) {
        return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
    }

    //Event Handlers
    window.addEventListener("resize", onWindowResize);


    init();
    animate();

}

ThreeJSCanvas(1);