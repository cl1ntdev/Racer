class EnemyCars {
    constructor(xpos,ypos,color,width,height,speed,image,status = false,){
        this.x = xpos;
        this.y = ypos;
        this.color = color;
        this.width = width;
        this.height = height
        this.speed = speed
        this.status = status;
        this.image = image;
    }

    draw(context){
        context.fillStyle = 'yellow'
        context.fillRect(this.x,this.y+=this.speed,this.width,this.height)
        // console.log(this.speed)
    }

    drawCar(context){
        // console.log(this.image)
        
        context.drawImage(this.image, this.x, this.y+=this.speed, this.width, this.height);
    }
    
}

class MyCar {
    constructor(xpos,ypos,color,width,height,speed,image){
        this.x = xpos;
        this.y = ypos;
        this.color = color;
        this.width = width;
        this.height = height
        this.speed = speed
        this.image = image
    }

    draw(context){
        context.fillStyle = this.color
        context.fillRect(this.x,this.y+=this.speed,this.width,this.height)
        // console.log(this.speed + 'maincar')
    }

    drawCar(context){
        context.drawImage(this.image, this.x, this.y+=this.speed, this.width, this.height);
    }
}

export {EnemyCars, MyCar};