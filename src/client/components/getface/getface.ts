// @ts-nocheck






const noseImages = [...Array(5).keys()].map(x => {
  const src = "src/client/components/getface/img/" + x + ".png"
  const img = new Image()
  img.onload = () => console.log('x =',x,'loaded!!')
  img.src = src
  return img
})

const SCALE = 500
export function face(canvas, SIZE) {
    const ctx = canvas.getContext("2d")
    canvas.height = SIZE
    canvas.width = SIZE

    function addProperty(self,prop,m) {
        self[prop] = {
            arr: m[0],
            iter: [0],
            choices: m,
            next: () => {
                const p = self[prop]
                p.arr = p.choices[++p.iter[0] % p.choices.length] 
            }
        }
    }

    const self = 
    {
        head:[7,100]
    }



    
    addProperty(self, 'color',[
        '#996600',
        '#00aaaa',
        'purple',
        'green',
        'black',
        'blue',
        'red',
    ])




    addProperty(self, 'nose',
    [...Array(5).keys()].map(x => noseImages[x].src))
      
    self.nose.img = noseImages[0]
    // self.nose.img.src = self.nose.arr
    self.nose.img.onload = () => {
        const superNext = self.nose.next
        self.nose.next = () => 
        {
            superNext()
            self.nose.img.src = self.nose.arr
        }
        self.show()
    }




    addProperty(self, 'eyes',[
        [30,26,4,200,Math.PI,0],
        [70,16,8,230,Math.PI,0], 
        [32,20,8,200,0,Math.PI],
        [32,20,8,200,0,7],
        [32,36,2,200,0,7],
        [32,18,14,200,0,7],
        [50,36,30,200,0,7],
        [32,16,8,200,Math.PI,0]
    ])




    addProperty(self, 'mouth',[
        [44,300,20,true],
        [44,300,20,false],
        [74,300,5,false],
        [30,300,50,true],
        [30,350,30,false],
        [30,350,10,false],
        [10,350,30,false],
        [80,350,20,true],
        [90,350,1,false],
        [5,350,1,false],
    ])




    addProperty(self,'hair',[
        [206,100,0,1,5],
        [230,100,0,2,2],
        [230,100,0,20,3],
        [],
    ])




    self.show = () => {

        const draw =(f)=> 
        {
            ctx.beginPath()
            f()
            ctx.closePath()
            ctx.fill()
        }








        drawHead: {
            const [fat,length] = self.head

            ctx.fillStyle = self.color.arr

            draw(()=> 
            {
                for(let i=0; i < length; i++)
                {
                  ctx.arc
                  ( SIZE * 250 / SCALE
                  , SIZE * (200 + i) / SCALE
                  , SIZE * (100 + i / fat) / SCALE | 0
                  , 0
                  , 7)
                }
            })
        }








        drawMouth: {
            const [width, height, stretch, smiling] = self.mouth.arr

            ctx.fillStyle = 'black'

            draw(()=> ctx.ellipse
              (250 * SIZE / SCALE
              , height * SIZE / SCALE
              , width * SIZE / SCALE
              , stretch * SIZE / SCALE
              ,0,0,7) )

            if (smiling) 
            {
                ctx.fillStyle = self.color.arr

                draw( () => ctx.rect
                  ( (250-width) * SIZE / SCALE
                  , (height-60) * SIZE / SCALE
                  , (width*2) * SIZE / SCALE
                  , 60 * SIZE / SCALE
                  ) )
            }
        }


        





        drawNose: {
            const size = 61 * SIZE / SCALE
            ctx.drawImage
              ( self.nose.img
              , SIZE/2 - size/2
              , 0.45 * SIZE
              , size
              , size
              )
        }








        drawEyes: {
            const [spread, radiusW, radiusB, height, SA, EA] = self.eyes.arr

            for (let A of [SIZE/2-spread * SIZE / SCALE, SIZE/2 + spread * SIZE / SCALE])
              for (let [B,C] of [[radiusW,'white'],[radiusB,'black']]) 
              {
                  ctx.fillStyle = C
                  draw(()=> ctx.arc
                    ( A
                    , height * SIZE / SCALE
                    , B * SIZE / SCALE
                    , SA
                    , EA) )
              }
        }








        drawHair: {
            const [xcoord,height,x,I,J] = self.hair.arr

            for (let i = 0; i < I; i++)

              for (let j = 0; j < J; j++) 
              {
                ctx.fillStyle = 'black'
                draw( ()=> 
                  ctx.ellipse
                    ( (xcoord+1-x*5+j*20) * SIZE / SCALE
                    , height * SIZE / SCALE
                    , 70 * SIZE / SCALE
                    , (17+j/2|0) * SIZE / SCALE
                    , i
                    , 0,7) )

                ctx.fillStyle = 'purple'
                draw( ()=> 
                  ctx.ellipse
                    ( (xcoord-x*5+j*20) * SIZE / SCALE
                    , height * SIZE / SCALE
                    , 70 * SIZE / SCALE
                    , (22-j) * SIZE / SCALE
                    , i
                    ,0,7) )
              }
        }

    }
    return { render() { self.show() }, canvas, next: 
      { hair: self.hair.next
      , eyes: self.eyes.next
      , color: self.color.next
      , nose: self.nose.next
      , mouth: self.mouth.next
      } }
}