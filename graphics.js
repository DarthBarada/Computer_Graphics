//
///
/////-------------- Координаты --------------//
///
//

/*
*   Класс описывающий обобщённые координаты
*/
class Coordinates
    {
        arr = [0,0,0,1] // массив [координата по x, координата по y, координата по z, дополнительный коэффициент]
        
        /*
            Конструктор класса.

            Принимает координаты через ','.
        */
        constructor(x = 0.0, y = 0.0, z = 0.0)
            {
                this.arr = [x,y,z,1];
            }
        /*
            Универсальный сеттер.

            Принимает либо объект того же класса, либо координаты через ','.
        */
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
        /*
            Функция проверки на эквивалентность.
        */
        equal(arg)
            {
                return ((this.arr[0] == arg.arr[0]) && (this.arr[1] == arg.arr[1]) && (this.arr[2] == arg.arr[2]));
            }
        /*
            Функция умножения координат на коэффициент.
        */
        multiply(arg)
            {
                this.arr[0] *= arg;
                this.arr[1] *= arg;
                this.arr[2] *= arg;
            } 
        x()
            {
                return this.arr[0];
            } 
        y()
            {
                return this.arr[1];
            } 
        z()
            {
                return this.arr[2];
            } 
    }

//
///
/////-------------- Вектор --------------//
///
//

/*
    Класс vector, наследуемый от coordinates.
*/
class Vector extends Coordinates
    {
        /*
            Конструктор класса.

            Принимает координаты через ','.
        */
        constructor(x = 0.0, y= 0.0, z= 0.0)
            {
               super(x,y,z);
            }
        /*
            Функция возвращающая длину вектора.
        */
        module()
            {
                return Math.sqrt(this.arr[0]*this.arr[0] + this.arr[1]*this.arr[1] + this.arr[2]*this.arr[2]);
            }
    }

/*
    Функция скалярного произведения векторов.
*/
function VV_multiply(arg1,arg2)
    {
        return ((arg1.arr[0] * arg2.arr[0]) + (arg1.arr[1] * arg2.arr[1]) + (arg1.arr[2] * arg2.arr[2]));
    }
/*
    Функция векторного произведения векторов.
*/
function VV_Vmultiply(arg1,arg2)
    {
        let tetha = Math.acos(VV_multiply(vec_1,vec_2).multiply(vec_1.module()*vec_2.module()));
        
        return (vec_1.module() * vec_2.module() * Math.sin(angle(vec_1,vec_2)));
    }
/*
    Функция сложения векторов.
*/
function VV_add(arg1,arg2)
    {
        return new Vector((arg1.arr[0] + arg2.arr[0]), (arg1.arr[1] + arg2.arr[1]), (arg1.arr[2] + arg2.arr[2]));
    }
/*
    Функция вычитания векторов.
*/
function VV_subtraction(arg1,arg2)
    {
        return new Vector((arg1.arr[0] - arg2.arr[0]), (arg1.arr[1] - arg2.arr[1]), (arg1.arr[2] - arg2.arr[2]));
    }
/*
    Функция вычисления угла между векторами.
*/
function angle(vec_1, vec_2)
    {
        return Math.acos(VV_multiply(vec_1,vec_2)/(vec_1.module()*vec_2.module()));
    }

//
///
/////-------------- Матрица --------------//
///
//

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

//
///
/////-------------- Геометрия --------------//
///
//

/*
*   Класс описывающий линию, имеет начало, конец и нормали.
*/
class Line
    {
        V0 = new Vector()	// V0 - начальная точка
        V1 = new Vector()	// V1 - точка конца
        //N = new Vector()	// N - нормаль линии
        vec = new Vector()	// Пространственный вектор
        e_vec = new Vector()// Постранственный единичный вектор

        constructor(start = new Vector(), end = new Vector())
            {
                this.V0.set(start);
                this.V1.set(end);

                var temp = VV_subtraction(end, start);
                this.vec.set(temp);
                this.e_vec.set((temp.arr[0]/Math.sqrt(Math.pow(temp.arr[0],2) + Math.pow(temp.arr[1],2) + Math.pow(temp.arr[2],2))),(temp.arr[1]/Math.sqrt(Math.pow(temp.arr[0],2) + Math.pow(temp.arr[1],2) + Math.pow(temp.arr[2],2))),(temp.arr[2]/Math.sqrt(Math.pow(temp.arr[0],2) + Math.pow(temp.arr[1],2) + Math.pow(temp.arr[2],2))));
            }
        set_coordinates(x0, y0, z0, x1, y1, z1)
            {
                this.V0.set(x0,y0,z0);
                this.V1.set(x1,y1,z1);

                var temp = VV_subtraction(this.V1, this.V0);
                this.vec.set(temp);
                this.e_vec.set((temp.arr[0]/Math.sqrt(Math.pow(temp.arr[0],2) + Math.pow(temp.arr[1],2) + Math.pow(temp.arr[2],2))),(temp.arr[1]/Math.sqrt(Math.pow(temp.arr[0],2) + Math.pow(temp.arr[1],2) + Math.pow(temp.arr[2],2))),(temp.arr[2]/Math.sqrt(Math.pow(temp.arr[0],2) + Math.pow(temp.arr[1],2) + Math.pow(temp.arr[2],2))));
            }
    }	
/*
*   Класс, созданный для описания полигона.
*/
class Polygon 
    {
        vertices = [] // Вершины, из которых состоит полигон
        uvs = []
        normal = new Vector();
        edges = [] // Грани, из которых состоит полигон
        /*
        *
        */
        init_edges()
            {
                this.edges = [];
                for (let index = 0; index + 1 < this.vertices.length; index++)
                    {
                        this.edges.push(new Line(this.vertices[index],this.vertices[index + 1]));
                    }
                this.edges.push(new Line(this.vertices[this.vertices.length - 1],this.vertices[0])); 
            }	
        init_normal()
            {
                if(this.vertices.length > 2)
                    {
                        let B = new Line(this.vertices[1], this.vertices[0]);
                        let A = new Line(this.vertices[1], this.vertices[2]); 
                        
                        let Nx = 0.0;
                        let Ny = 0.0;
                        let Nz = 0.0; 
                        // При вычислении нормали может быть 3 по 2 способов решений
                        if((((B.vec.z()*A.vec.y()) - (B.vec.y()*A.vec.z())) != 0.0) && (A.vec.y() != 0.0))
                            {
                                Nx = 1.0;
                                Nz = (B.vec.y()*A.vec.x()/A.vec.y() - B.vec.x())/(B.vec.z() - ((B.vec.y()*A.vec.z())/A.vec.y()));
                                Ny = (-A.vec.x() - Nz*A.vec.z())/A.vec.y();
                            } 
                        else if (((B.vec.y() - ((B.vec.z()*A.vec.y())/A.vec.z())) != 0.0) && (A.vec.z() != 0.0))
                            {
                                Nx = 1.0;
                                Ny = (B.vec.x() - B.vec.z()*A.vec.x()/A.vec.z())/(B.vec.y() - ((B.vec.z()*A.vec.y())/A.vec.z()));
                                Nz = (-A.vec.x() - Ny*A.vec.y())/A.vec.z();
                            }
                        else if (((B.vec.y()*A.vec.x() - B.vec.x()*A.vec.y()) != 0.0) && (A.vec.x() != 0.0))
                            {
                                Nz = 1.0;
                                Ny = (B.vec.x()*A.vec.z() - B.vec.z()*A.vec.x())/(B.vec.y()*A.vec.x() - B.vec.x()*A.vec.y());
                                Nx = (-A.vec.z() - Ny*A.vec.y())/A.vec.x();
                            }
                        else if (((B.vec.x()*A.vec.y() - B.vec.y()*A.vec.x()) != 0.0) && (A.vec.y() != 0.0))
                            {
                                Nz = 1.0;
                                Nx = (B.vec.y()*A.vec.z() - B.vec.z()*A.vec.y())/(B.vec.x()*A.vec.y() - B.vec.y()*A.vec.x());
                                Ny = (-A.vec.z() - Nx*A.vec.x())/A.vec.y();
                            }
                        else if (((B.vec.z()*A.vec.x() - B.vec.x()*A.vec.z()) != 0.0) && (A.vec.x() != 0.0))
                            {
                                Ny = 1.0;
                                Nz = (B.vec.x()*A.vec.y() - B.vec.y()*A.vec.x())/(B.vec.z()*A.vec.x() - B.vec.x()*A.vec.z());
                                Nx = (-A.vec.y() - Nz*A.vec.z())/A.vec.x();
                            }
                        else if (((B.vec.x()*A.vec.z() - B.vec.z()*A.vec.x()) != 0.0) && (A.vec.z() != 0.0))
                            {
                                Ny = 1.0;
                                Nx = (B.vec.z()*A.vec.y() - B.vec.y()*A.vec.z())/(B.vec.x()*A.vec.z() - B.vec.z()*A.vec.x());
                                Nz = (-A.vec.y() - Nx*A.vec.x())/A.vec.z();
                            }
                        else
                            {
                                console.log();("Что-то пошло не так при вычислении нормалей!");
                                Nz = 1.0;
                                Ny = (B.vec.x()*A.vec.z() - B.vec.z()*A.vec.x())/(B.vec.y()*A.vec.x() - B.vec.x()*A.vec.y());
                                Nx = (-A.vec.z() - Ny*A.vec.y())/A.vec.x();
                            }
                        this.normal.set(Nx,Ny,Nz);
                    }
            }						
    }
/*
*   Класс, созданный для описания объекта.
*/
class Figure 
    {
        center = new Vector(0,0,0)

        angles = [0,0,0]
        scale = [1,1,1]
        shift = [0,0,0]

        faces = []
        constructor(){}

        check_normals()
            {
                for(let face = 0; face < this.faces.length;face++)
                    {
                        let CurrentFace = this.faces[face];
                        
                        if(CurrentFace.vertices.length > 0)
                            {
                                let middle = VV_subtraction(CurrentFace.vertices[1], CurrentFace.vertices[2]);
                                middle.multiply(0.5);
                                middle = VV_add(middle,CurrentFace.vertices[2]);

                                let temp_line = new Line(middle,this.center);
                                let num = VV_multiply(temp_line.vec,CurrentFace.normal);
                                if (num < 0)
                                    {
                                        CurrentFace.normal.multiply(-1);    
                                    }
                            }
                    }
            }
    }

//
///
/////-------------- Цвет и свет --------------//
///
//

class Dye
    {
        red = 0
        green = 0
        blue = 0
    }

class LightSource
    {
        dye = new Dye()
        position = new Coordinates()
        constructor(){}
    }

//
///
/////--------------  --------------//
///
//

/*
*   Класс сцены
*/
class Scene
    {
        alpha = 0.0  // Угол вращения по оси x в радианах
        beta = 0.0    // Угол вращения по оси y радианах
        gamma = 0.0  // Угол вращения по оси z радианах

        scale_x = 1
        scale_y = 1
        scale_z = 1

        move_x = 0.0
        move_y = 0.0
        move_z = 0.0

        Camera_pos = new Vector (0,0,1000)
        light_source = new LightSource()
        object = new Figure() ///< Объект сцены

        constructor()
            {
                this.light_source.position.set(0,0,500);
                this.light_source.dye.red = 255;
            }
        move(x, y=x, z=x)
            {
                this.move_x = x;
                this.move_y = y;
                this.move_z = z;
            }
        scale(x,y=x,z=x)
            {
                this.scale_x = x;
                this.scale_y = y;
                this.scale_z = z;                 
            }
        rotate(dalpha = 0.0, dbeta = 0.0, dgamma = 0.0)
            {
                // Переводим из градусов в радианы
                dalpha = (dalpha/180)*Math.PI;
                dbeta = (dbeta/180)*Math.PI;
                dgamma = (dgamma/180)*Math.PI;

                this.alpha = dalpha;
                this.beta = dbeta;
                this.gamma = dgamma;
                
                if (this.alpha >= Math.PI || this.alpha <= -Math.PI)
					{
						this.alpha = this.alpha - 1*(this.alpha/Math.abs(this.alpha))*2*Math.PI + 0.000001;
                    }
                if (this.beta >= Math.PI || this.beta <= -Math.PI)
					{
						this.beta = this.beta - 1*(this.beta/Math.abs(this.beta))*2*Math.PI + 0.000001;
                    }
                if (this.gamma >= Math.PI || this.gamma <= -Math.PI)
					{
						this.gamma = this.gamma - 1*(this.gamma/Math.abs(this.gamma))*2*Math.PI + 0.000001;
                    }
            }
        draw(ctx, dx = 250, dy = 250, object = this.object)
            {
                let local_pos = object.center;
                let MatScale = new ScaleMatrix(this.scale_x,this.scale_y,this.scale_z);
                let MatMove = new ShiftMatrix(this.move_x,this.move_y,this.move_z);
                let MatRot = new RotationMatrix(this.alpha,this.beta,this.gamma);
                let ResultMat = MM_multiply(MatScale,MM_multiply(MatMove,MM_multiply(new ShiftMatrix(-local_pos.arr[0],-local_pos.arr[1],-local_pos.arr[2]),MM_multiply(MatRot,new ShiftMatrix(-local_pos.arr[0],-local_pos.arr[1],-local_pos.arr[2])))));
                let is_visible = true;    
                   
                ctx.fillStyle = "#000000";
                for(let index = 0; index < object.faces.length; index++)
                    {
                        let CurrentFace = object.faces[index];
                        let normal = copy(CurrentFace.normal);

                        normal.multiply(10);
                        normal = VM_multiply(normal,ResultMat);

                        let view_vec = VV_subtraction(normal,this.Camera_pos);
                        let angle_ = angle(normal,view_vec);

                        if((angle_*180/Math.PI) >= 90)
                            {
                                is_visible = false;
                            }

                        if (is_visible)
                            {
                                let points = []; 
                                for (let ind = 0; ind < CurrentFace.vertices.length; ind++)
                                    {
                                        let New_point = VV_add(VM_multiply(CurrentFace.vertices[ind],ResultMat),new Vector(dx,dy,0));
                                        points.push(New_point);
                                    } 

                                ctx.beginPath(); 
                                ctx.moveTo(points[0].x(),points[0].y());
                                for(let i = 1; i < points.length;i++)
                                    {
                                        ctx.lineTo(points[i].x(),points[i].y());
                                    }
                                ctx.lineTo(points[0].x(),points[0].y());

                                let cosa = Math.cos(angle(normal,VV_subtraction(normal,this.light_source.position)));
                                let new_colour = "rgb(" + this.light_source.dye.red*cosa + "," + this.light_source.dye.green*cosa + "," + this.light_source.dye.blue*cosa + ")";
                                ctx.fillStyle=new_colour;
                                ctx.strokeStyle=new_colour;
                                ctx.fill();
                                ctx.stroke();
                                
                            } 
                        
                        is_visible = true;
                    }
            }
        }

function obj_parse(text) 
    {
        let object = new Figure();

        var vertexList = [];
        var uvList = [];
        var normalList = [];
        
        //Function to add vertex data
        var addFace = function (face,group) 
            {
                var indeces = group.split("/");
                
                if (indeces.length == 3)
                    {
                        if (indeces[0] != "")
                            face.vertices.push(vertexList[parseInt(indeces[0]) - 1]);                       
                        if (indeces[1] != "")
                            face.uvs.push(parseInt(indeces[1]) - 1);
                        if (indeces[2] != "")
                            face.normals.push(parseInt(indeces[2]) - 1);
                    }
                else if (indeces.length == 2)
                    {
                        if (indeces[0] != "")
                            face.vertices.push(vertexList[parseInt(indeces[0]) - 1]);
                        if (indeces[1] != "")
                            face.uvs.push(parseInt(indeces[1]) - 1);    
                    }
                else if (indeces.length == 1)
                    {
                        if (indeces[0] != "")
                            face.vertices.push(vertexList[parseInt(indeces[0]) - 1]);
                    }
                else
                    {
                        alert("Что-то пошло не так! Проверьте файл .obj!");
                        location.reload();
                    }
            }

        var lines = text.split("\n");

        for (var i = 0; i < lines.length; i++) 
            {
                var params = lines[i].split(" ");

                if (params[0] === "v") // VERTEX
                    { 
                        vertexList.push(new Vector(parseFloat(params[1]),parseFloat(params[2]),parseFloat(params[3])));
                    }
                
                if (params[0] === "vt") // UV
                    {
                        uvList.push(new Vector(parseFloat(params[1]),parseFloat(params[2]),"UV"));
                    }
                
                if (params[0] === "vn") // NORMAL
                    { 
                        normalList.push(new Vector(parseFloat(params[1]),parseFloat(params[2]),parseFloat(params[3])));
                    }
                
                if (params[0] === "f")  // FACE
                    {
                        let face = new Polygon();
                        for (var j = 1; j < params.length; j++) 
                            {                           
                                addFace(face, params[j]);
                            }
                        face.init_edges();
                        face.init_normal();
                        object.faces.push(face);
                    } 
            }

        object.check_normals();

        return object;
    }

function getRandomColor() 
    {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) 
            {
                color += letters[Math.floor(Math.random() * 16)];
            }
        return color;
    }

function copy(arg)
    {
        return new Vector(arg.x(),arg.y(),arg.z());
    }