/*
*   @brief Функция рисования линии методом Брезенхема
*/
function Draw_Line(ctx,x0,y0,x1,y1)
    {
        let dy = Math.abs(y1-y0);
        let dx = Math.abs(x1-x0);

        let dmax = Math.max(dx,dy);
        let dmin = Math.min(dx,dy);

        let xdir = 1;
        let ydir = 1;

        if(x1<x0) xdir = -1;
        if(y1<y0) ydir = -1;

        let eps = 0; 
        let k = 2*dmin;

        if(dy <= dx)
            {
                let y = y0;
                for(let x=x0; x*xdir<=x1*xdir;x+=xdir)
                    {
                        ctx.fillRect(x,y,1,1);
                        eps = eps+k;
                        if(eps > dmax)
                            {
                                y += ydir;
                                eps = eps - 2*dmax;
                            }
                    }	
            }
        else
            {
                let x = x0;
                for(let y=y0; y*ydir<=y1*ydir;y+=ydir)
                    {
                        ctx.fillRect(x,y,1,1);
                        eps = eps+k;
                        if(eps > dmax)
                            {
                                x += xdir;
                                eps = eps - 2*dmax;
                            }
                    }	
            }
    }

class Coordinates
    {
        arr = [0,0,0,1]
        
        constructor(x = 0.0, y = 0.0, z = 0.0)
            {
                this.arr = [x,y,z,1];
            }

        set(arg1 = undefined, arg2 = undefined, arg3 = undefined)
            {
                if (typeof arg1 == "object")
                    {
                        this.arr = arg1.arr;
                    }
                else if ((typeof arg1 == "number") && (typeof arg2 == "number") && (typeof arg3 == "number"))
                    {
                        this.arr = [arg1, arg2, arg3, 1];
                    }
            }

        equal(arg)
            {
                return ((this.arr[0] == arg.arr[0]) && (this.arr[1] == arg.arr[1]) && (this.arr[2] == arg.arr[2]));
            }

        multiply(arg)
            {
                this.arr[0] *= arg;
                this.arr[1] *= arg;
                this.arr[2] *= arg;
            }  
    }

class Vector extends Coordinates
    {
        constructor(x = 0.0, y= 0.0, z= 0.0)
            {
               super(x,y,z);
            }
        module()
            {
                return Math.sqrt(this.arr[0]*this.arr[0] + this.arr[1]*this.arr[1] + this.arr[2]*this.arr[2]);
            }
        rotate(angle,axis)
            {
                if(axis == "X")
                    {
                        this.arr = VM_multiply(this, new RotationMatrix(angle,0,0)).arr;
                    }
                else if (axis == "Y") 
                    {
                        this.arr = VM_multiply(this, new RotationMatrix(0,angle,0)).arr;
                    }
                else if (axis == "Z") 
                    {
                        this.arr = VM_multiply(this, new RotationMatrix(0,0,angle)).arr;  
                    }             
            }
    }

class Vertex extends Coordinates {}

/*
    Класс описывающий матрицы в обобщённых координатах
*/
class Matrix
    {
        constructor()
            {
                this.arr = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]; 
            }
    } 

class RotationMatrix extends Matrix
    {
        constructor(x_rot = 0.0, y_rot = 0.0,z_rot = 0.0)
            {
                super();

                let xMat = new Matrix();
                let yMat = new Matrix();
                let zMat = new Matrix();
                // Вращаем вокруг оси X
                xMat.arr[1][1] = Math.cos(x_rot); 
                xMat.arr[1][2] = -Math.sin(x_rot);
                xMat.arr[2][1] = Math.sin(x_rot); 
                xMat.arr[2][2] = Math.cos(x_rot);
                // Вращаем вокруг оси Y
                yMat.arr[0][0] = Math.cos(y_rot); 
                yMat.arr[0][2] = Math.sin(y_rot);
                yMat.arr[2][0] = -Math.sin(y_rot); 
                yMat.arr[2][2] = Math.cos(y_rot);
                // Вращаем вокруг оси Z
                zMat.arr[0][0] = Math.cos(z_rot); 
                zMat.arr[0][1] = -Math.sin(z_rot);
                zMat.arr[1][0] = Math.sin(z_rot); 
                zMat.arr[1][1] = Math.cos(z_rot);

                this.arr = MM_multiply(xMat,MM_multiply(yMat,zMat)).arr;
            }
    }
class ScaleMatrix extends Matrix
    {
        constructor(x_scale = 1.0, y_scale = x_scale, z_scale = x_scale)
            {
                super();

                this.arr = [[x_scale,0,0,0],[0,y_scale,0,0],[0,0,z_scale,0],[0,0,0,1]]; 
            }
    }

class ShiftMatrix extends Matrix
    {
         constructor(x_shift = 0.0, y_shift = 0.0, z_shift = 0.0)
            {
                super();

                this.arr = [[1,0,0,x_shift],[0,1,0,y_shift],[0,0,1,z_shift],[0,0,0,1]]; 
            }
    }

function MM_multiply(m1,m2)
    {
        res = new Matrix();
        for(let i = 0; i < res.arr.length; i++)
            {
                for(let j = 0; j < res.arr[i].length; j++)
                    {
                        res.arr[i][j] = 0;
                        for(let k = 0; k < res.arr[i].length; k++)
                            {
                                res.arr[i][j] += m1.arr[i][k]*m2.arr[k][j];
                            }
                    }
            }
        return res;
    }
    
function VM_multiply(vec,mat)
    {
        resultVector = new Vector();
        for(let i = 0; i < vec.arr.length; i++)
            {
                resultVector.arr[i] = 0;
                for(let j = 0; j < vec.arr.length; j++)
                    {
                        resultVector.arr[i] += mat.arr[i][j]*vec.arr[j];
                    }
            }
        return resultVector;
    }

function VV_multiply(arg1,arg2)
    {
        return ((arg1.arr[0] * arg2.arr[0]) + (arg1.arr[1] * arg2.arr[1]) + (arg1.arr[2] * arg1.arr[2]));
    }
function VV_add(arg1,arg2)
    {
        return new Vector((arg1.arr[0] + arg2.arr[0]), (arg1.arr[1] + arg2.arr[1]), (arg1.arr[2] + arg1.arr[2]));
    }
function VV_subtraction(arg1,arg2)
    {
        return new Vector((arg1.arr[0] - arg2.arr[0]), (arg1.arr[1] - arg2.arr[1]), (arg1.arr[2] - arg1.arr[2]));
    }

