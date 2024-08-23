import {EnemyCars, MyCar} from "./classes.js";
let canvas = document.querySelector('#field')
const carMovement = 5;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 150;

let context = canvas.getContext('2d')
let startGame = false;
let speedControl = 1
let speedMoving = 0
let totMidLines = 30
let mainScore = 0;
let highScore = 0
let intervalIdEnemy;
let randomCarsSpawnLocationX = [260,260]// 260, 50


let storageScore = localStorage.getItem('racer-score')
if(!storageScore || storageScore === null || storageScore === undefined){
    localStorage.setItem('racer-score',JSON.stringify(0))
    highScore = 0;
    document.querySelector('.highest-score').innerText = 'Highest Score: ' + highScore
}else{
    highScore = JSON.parse(localStorage.getItem('racer-score'))
    document.querySelector('.highest-score').innerText = 'Highest Score: ' + highScore
}


//hide first
document.querySelector('.game-interface').style.display = 'none'
document.querySelector('.controls').style.display = 'none'
document.querySelector('#score').style.display = 'none'
document.querySelector('.pop-up').style.display = 'none'


document.querySelector('#start-button').addEventListener('click',(e)=>{
    start()
    e.target.style.display = 'none'
    document.querySelector('.highest-score').style.display = 'none'
    document.querySelector('.game-interface').style.display = 'block'
    document.querySelector('.controls').style.display = 'block'
    document.querySelector('#score').style.display = 'block'
})

document.querySelector('#fail-confirm').addEventListener('click',(e)=>{
   location.reload()
})

const start = () =>{
    startGame = true
    startEnemySpawn()
}

window.addEventListener('keydown',(e)=>{
    switch(e.key){
        case 'w':
            move('up')
            break;
        case 'a':
            move('left')
            break;
        case 's':
            move('down')
            break;
        case 'd':
            move('right')
            break;
    
    }
})

const drawRoad = () =>{
    context.fillStyle = 'black'
    context.fillRect(0,0,canvas.width,canvas.height)


    context.fillStyle = 'white'
    context.fillRect(0,0,10,canvas.height)
    context.fillRect(canvas.width-10 ,0,10,canvas.height)

}



const gapAdd = 70
const drawLineSeparator = ()=>{
    
    let gap = -canvas.height
    context.fillStyle = 'white'
    for(let i = 0;i<totMidLines;i++){
        context.fillRect(canvas.width / 2 ,gap + speedMoving,10,40)
       
        gap+=gapAdd
    }
    if(!startGame){
        return
    } 
    speedMoving+=speedControl

    if(speedMoving > gapAdd){
        speedMoving =- 70   
    }
}



let carX = canvas.width / 2 - 50
let carY = canvas.height - 150
let carWidth = 100
let carHeight = 160
const mainCarImgSrc = new Image()
mainCarImgSrc.src = './car3.png'

let carBase;
const drawCar = () =>{
    const mainCar = new MyCar(carX,carY,'blue',carWidth,carHeight,1,mainCarImgSrc)
    // mainCar.draw(context)
    
    mainCar.drawCar(context)
    carBase = mainCar
}

let enemyCarsArr = []
let addTimeSpawn = 5000

let initGenRadnomCars = () =>{
    if(!startGame){
        return
    }
    let randomCarsSpawnLocationY = -90;
    const randIndex = Math.floor(Math.random() * randomCarsSpawnLocationX.length);
    const randomPosX = randomCarsSpawnLocationX[randIndex];

    if(enemyCarsArr.length >= 5){
        return;
    }
    
    const randomNum = Math.floor(Math.random() * 3) + 1
    let imageSrc = new Image();
    switch(randomNum){
        case 1:
            imageSrc.src = './car1.png'
            break;
        case 2:
            imageSrc.src = './car2.png'
            break;
        case 3:
            imageSrc.src = './car4.png'
            break;
    }
    // console.log(imageSrc)
    
    

    const enemyCar = new EnemyCars(randomPosX, randomCarsSpawnLocationY, 'blue', carWidth, carHeight, speedControl,imageSrc);
    enemyCarsArr.push(enemyCar);
}





//canvas ups
const updateCanvas = () =>{//second initialize
    context.clearRect(0,0,canvas.width,canvas.height)
    drawRoad()
    drawLineSeparator()
    drawCar()
    if(startGame){
        enemyCarsArr.forEach((car,index)=>{
            car.speed = speedControl
            // car.draw(context)
            car.drawCar(context)
            if(car.y > canvas.height){
                enemyCarsArr.splice(index,1)
            }
            if(
                carBase.x + carBase.width >= car.x && 
                carBase.x <= car.x + car.width && 
                carBase.y + carBase.height >= car.y &&
                carBase.y <= car.y + car.height
            ){
                startGame = false // game over
                document.querySelector('.pop-up').style.display = 'block'
                document.querySelector('#show-score-defeat').innerText = 'YOUR SCORE IS ' + mainScore
                document.querySelector('.game-interface').style.display = 'none'
                document.querySelector('.controls').style.display = 'none'
                document.querySelector('#score').style.display = 'none'
                if(highScore < mainScore){
                    localStorage.setItem('racer-score',JSON.stringify(mainScore))
                }

            }
            if(carBase.y + carBase.height >= car.y && carBase.y <= car.y + car.height && car.status === false){
                // console.log('great')
                car.status = true
                mainScore++
            }
        })
    }
    document.querySelector('#score').innerText = mainScore
}

let startEnemySpawn = () =>{
    intervalIdEnemy = setInterval(initGenRadnomCars,addTimeSpawn)
}

function updateSpawnInterval(){
    clearInterval(intervalIdEnemy)
    startEnemySpawn()
}


let carSpawning = []
let scoreIncreBase = 5
const updateSpeed = () =>{
    // console.log(mainScore)
    if(mainScore === scoreIncreBase){
        scoreIncreBase+=10
        speedControl+=2
        if(mainScore > 2 && addTimeSpawn > 500){
            if(addTimeSpawn === 1000){
                addTimeSpawn-=800
                return
            }
            addTimeSpawn -= 1000
            updateSpawnInterval()
           
        }
        
    }

}

const animate = () => { //first inintalize
    drawRoad()
    drawCar()
    drawLineSeparator()
    updateCanvas()
    updateSpeed()
    requestAnimationFrame(animate)
}
animate()



//movement 
document.querySelectorAll('.ctrl').forEach(button=>{
    const buttonDirection = button.getAttribute('action-direction')
    console.log(buttonDirection)
    button.addEventListener('touchstart',()=>{
        move(buttonDirection)
    })
})

const move = (action) =>{
    if(!startGame){
        return
    }

    
    switch(action){
    case 'up':
        if(carY + carHeight <= 133){
            return
        }
         carY-=carMovement;
         break;
     case 'left':
        if(carX <= 0){
            return
        }
            carX-=carMovement;
            break;
     case 'down':
        if(carY >= 613){
            return
        }
            carY+=carMovement;
            break;
     case 'right':
        if(carX + carWidth >= canvas.width){
            return
        }
            carX+=carMovement;
            break;
    }    
}

//to do
//fix spawning issue ,they overlap