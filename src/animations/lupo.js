import ImprovedNoise from '../util/improved_noise'
import TextureAnimator from '../util/texture_animator'

export default class LupoAnimation extends THREE.Object3D {
    constructor() {
        super();
        this.BASE_PATH = 'assets/animations/lupo';
    }

    init(loadingManager) {
        this.loadingManager = loadingManager;
        this.setupAnim();
    }

    setupAnim() {
        this.loadingManager.itemStart("LupoAnim");
        this.perlin = new ImprovedNoise();

        let tl = new TimelineMax({delay: 5, repeatDelay: 3, repeat: -1});

        // setup animation sequence
        this.animStart = false;
        this.sequenceConfig = [
            { time: 5, anim: ()=>{this.showSculptures()} }
        ];

        let p_tex_loader = new THREE.TextureLoader(this.loadingManager);

        this.baseMat = new THREE.MeshLambertMaterial( { color: 0x9f43fa, wireframe: true } );
        this.bottomMat = new THREE.MeshLambertMaterial( { color: 0x43fa9f} );
        this.topMat = new THREE.MeshLambertMaterial( { color: 0xfa9f43} );

        let modelLoader = new THREE.JSONLoader(this.loadingManager);

        let sculptureModelFiles = [ [this.BASE_PATH + "/models/sculptures/deer.js", new THREE.Vector3(2, 0, 2)],
                                    [this.BASE_PATH + "/models/sculptures/dog.js", new THREE.Vector3(-2, 0, 1.5)],
                                    [this.BASE_PATH + "/models/sculptures/macho.js", new THREE.Vector3(-3.8, .7, 0.5)],
                                    [this.BASE_PATH + "/models/sculptures/painter.js", new THREE.Vector3(5, 1, -1)],
                                    [this.BASE_PATH + "/models/sculptures/pig.js", new THREE.Vector3(3.5, 0, 1)],
                                    [this.BASE_PATH + "/models/sculptures/right_arm.js", new THREE.Vector3(2.7, .5, -1)],
                                    [this.BASE_PATH + "/models/sculptures/short_legs.js", new THREE.Vector3(-2.5, .3, 1.8)],
                                    [this.BASE_PATH + "/models/sculptures/two_heads.js", new THREE.Vector3(0, 1, -1.4)] ];
        let sculptureTextureFiles = [ this.BASE_PATH + "/images/sculptures/lupo_deer.png",
                                      this.BASE_PATH + "/images/sculptures/lupo_dog.png",
                                      this.BASE_PATH + "/images/sculptures/lupo_macho.png",
                                      this.BASE_PATH + "/images/sculptures/lupo_painter.png",
                                      this.BASE_PATH + "/images/sculptures/lupo_pig.png",
                                      this.BASE_PATH + "/images/sculptures/lupo_rightArm.png",
                                      this.BASE_PATH + "/images/sculptures/lupo_shortLegs.png",
                                      this.BASE_PATH + "/images/sculptures/lupo_twoHeads2.png" ];
        let sculptureTextMADFiles = [ this.BASE_PATH + "/images/sculptures/lupo_deer_MAD.png",
                                      this.BASE_PATH + "/images/sculptures/lupo_dog_MAD.png",
                                      this.BASE_PATH + "/images/sculptures/lupo_macho_MAD.png",
                                      this.BASE_PATH + "/images/sculptures/lupo_painter_MAD.png",
                                      this.BASE_PATH + "/images/sculptures/lupo_pig_MAD.png",
                                      this.BASE_PATH + "/images/sculptures/lupo_rightArm_MAD.png",
                                      this.BASE_PATH + "/images/sculptures/lupo_shortLegs_MAD.png",
                                      this.BASE_PATH + "/images/sculptures/lupo_twoHeads_MAD.png" ];

        let sculptureModels=[];
        this.sculptureMaterials=[];
        this.sculptureTextures=[];
        this.sculptureMADMaterials=[];
        this.sculptureMADTextures=[];

        // v.OLD
        // this.loadModelSculptures(this.BASE_PATH + "/models/base.js", this.BASE_PATH + "/models/top.js", this.BASE_PATH + "/models/down.js,")
        // .then((lupoArt) => {
        //     this.lupoArt = lupoArt;
        //     this.lupoArt.position.set(.7,-1.2,3);
        //     this.add(this.lupoArt);
        //     console.log("Loaded lupo art", this.lupoArt);
        //     // trigger rotating
        //     // TweenMax.to(this.lupoArt.rotation, 1, {x:Math.PI, repeat:-1, repeatDelay:2, yoyo:true});

        //     tl.to(this.lupoArt.rotation, 2, {x:Math.PI}).to(this.lupoArt.rotation, 2, {x:Math.PI*2}, "+=2");
        // });

        this.loadSculptureTextures( sculptureTextureFiles, sculptureTextMADFiles )
        .then( () => {

            // this.sculptureTextures = lupoArtText;
            // this.sculptureMaterials = lupoArtMat;
            // console.log("Loaded lupo art materials", lupoArtMat);

            this.loadSculptureModels( sculptureModelFiles )
            .then((lupoArt) => {
                this.lupoArt = lupoArt;
                this.lupoArt.position.set(.7,-1.2,3);
                this.add(this.lupoArt);
                console.log("Loaded lupo art", this.lupoArt);

                console.log(this.lupoArt.children[0].children);
                // trigger rotating
                // tl.to(this.lupoArt.rotation, 2, {x:Math.PI}).to(this.lupoArt.rotation, 2, {x:Math.PI*2}, "+=2");

                // testing scaling animation

                // for(let i=0; i<this.lupoArt.children[0].children.length; i++){
                //     TweenMax.to(this.lupoArt.children[0].children[i].scale, 2, {x:1, y:1, z:1, delay: 10});
                // }
            });
        });

        this.completeSequenceSetup();

        this.loadingManager.itemEnd("LupoAnim");
    }

    completeSequenceSetup() {
        for(let i=0; i<this.sequenceConfig.length; i++){
            this.sequenceConfig[i].performed = false;
        }
    }

    showSculptures() {
        for(let i=0; i<this.lupoArt.children[0].children.length; i++){
            TweenMax.to(this.lupoArt.children[0].children[i].scale, 1, {y:1, delay: i*0.5});
        }
    }

    loadSculptureTextures ( textureFiles, textureMADFiles ) {
        let promise = new Promise( (resolve, reject) => {
            // this.sculptureTextures = lupoArtText;
            // this.sculptureMaterials = lupoArtMat;
            // let lupoArtText=[];
            // let lupoArtMat=[];
            let tex_loader = new THREE.TextureLoader(this.loadingManager);
            for(let i=0; i<textureFiles.length; i++){
                let _tex = tex_loader.load( textureFiles[i] );
                this.sculptureTextures.push( _tex );
                let _mat = new THREE.MeshPhongMaterial({map: _tex, transparent: true, shininess: 100});
                this.sculptureMaterials.push( _mat );
            }
            for(let i=0; i<textureMADFiles.length; i++){
                let _tex = tex_loader.load( textureMADFiles[i] );
                this.sculptureMADTextures.push( _tex );
                let _mat = new THREE.MeshPhongMaterial({map: _tex, transparent: true, shininess: 100});
                this.sculptureMADMaterials.push( _mat );
            }
            resolve();
        });
        return promise;
    }

    loadSculptureModels ( modelFiles ) {
        let promise = new Promise( (resolve, reject) => {
            let lupoArt = new THREE.Object3D();
            let lupoArtTop = new THREE.Object3D();
            let lupoArtBottom = new THREE.Object3D();
            let loader = new THREE.JSONLoader(this.loadingManager);

            for(var i = 0; i < modelFiles.length; i++){
                let modelF = modelFiles[i][0];
                let modelPos = modelFiles[i][1];
                let matF = this.sculptureMaterials[i];
                let matMADF = this.sculptureMADMaterials[i];

                loader.load( modelF, (geometry) => {
                    let meshhh = new THREE.Mesh( geometry, matF );
                    meshhh.position.copy( modelPos );
                    meshhh.scale.multiplyScalar( 0.01 );
                    lupoArtTop.add(meshhh);

                    let meshh = new THREE.Mesh( geometry, matMADF );
                    meshh.position.copy( modelPos );
                    lupoArtBottom.add(meshh);
                });
                // this.loadModels.bind(undefined, loader, i);
            }

            lupoArt.add( lupoArtTop );
            lupoArtBottom.rotation.x = Math.PI;
            lupoArt.add( lupoArtBottom );

            resolve( lupoArt );
        });
        return promise;
    }

    loadModelSculptures (model, modelT, modelB) {

        let promise = new Promise( (resolve, reject) => {
            let loader = new THREE.JSONLoader(this.loadingManager);

            loader.load(model, (geometry, material) => {

                let lupoArt = new THREE.Object3D();

                let s_base = new THREE.Mesh( geometry, this.baseMat );
                // s_base.rotation.y = 30/180*Math.PI;
                lupoArt.add( s_base );
                
                loader.load(modelT, (geometryT, materialT) => {
                    let s_top = new THREE.Mesh( geometryT, this.topMat );
                    // s_top.rotation.y = 30/180*Math.PI;
                    lupoArt.add( s_top );

                    loader.load(modelB, (geometryB, materialB) => {
                        let s_bottom = new THREE.Mesh( geometryB, this.bottomMat );
                        // s_bottom.rotation.y = 30/180*Math.PI;
                        lupoArt.add( s_bottom );

                        resolve(lupoArt);
                    });
                });
                
            });
        });
        return promise;
    }

    update(dt,et) {
        // ANIMATION_SEQUENCE
        if(!this.animStart){
            this.animStartTime = et;
            this.animStart = true;
        }

        if(this.animStart){
            let animTime = et-this.animStartTime;

            for(let i=0; i<this.sequenceConfig.length; i++){

                if(animTime >= this.sequenceConfig[i].time && !this.sequenceConfig[i].performed){

                    this.sequenceConfig[i].anim( this );
                    this.sequenceConfig[i].performed = true;
                    console.log("Animation log: do anim sequence: " + i);
                }
            }
        }
    }
}

