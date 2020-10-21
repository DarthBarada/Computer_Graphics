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

/*
*	@brief Класс для описания вектора / точки, имеет координаты x и y.
*/
class Vector {
        x = 0.0
        y = 0.0
        z = 0.0

        constructor(x = 0.0, y = 0.0, z = 0.0)
            {
                this.x = x;
                this.y = y;
                this.z = z;
            }
        
        set_coordinates(x = 0.0,y = 0.0,z = 0.0)
            {
                this.x = x;
                this.y = y;
                this.z = z;
            }
        set_from_point(vec)
            {
                this.x = vec.x;
                this.y = vec.y;
                this.z = vec.z;
            }
        multiply_num(num)
            {
                this.x *= num;
                this.y *= num;
                this.z *= num;
            }
        module()
            {
                return Math.sqrt(Math.pow(x,2) + Math.pow(y,2) + Math.pow(z,2));
            }
        Equal(p2)
            {
                if((this.x == p2.x)&&(this.y == p2.y)&&(this.z == p2.z))
                    {
                        return true;
                    }
                return false;
            }
    }
/*
*	@brief Функция скалярного умножения векторов.
*
*	@return Число.
*/
function SMultiply(vec_1, vec_2)
    {
        return ((vec_1.x * vec_2.x) + (vec_1.y * vec_2.y) + (vec_1.z * vec_2.z));
    }
/*
*	@brief Функция скалярного произведения векторов.
*
*	@return Угол между векторами.
*/
function angle(vec_1, vec_2)
    {
        return Math.acos(SMultiply(vec_1,vec_2).multiply_num(vec_1.module()*vec_2.module()));
    }
/*
*	@brief Функция вычисления векторного произведения векторов.
*
*	@return Число.
*/
function VMultiply(vec_1, vec_2)
    {
        let tetha = Math.acos(SMultiply(vec_1,vec_2).multiply_num(vec_1.module()*vec_2.module()));
        
        return vec_1.module() * vec_2.module() * Math.sin(angle(vec_1,vec_2));
    }
/*
*	@brief Функция вычитания векторов.
*
*	@return Вектор разности.
*/
function Subtraction(vec_1 = new Vector(),vec_2 = new Vector())
    {
        return new Vector((vec_1.x - vec_2.x), (vec_1.y - vec_2.y), (vec_1.z - vec_2.z))
    }
/*
*	@brief Функция сложения векторов.
*
*	@return Вектор суммы.
*/
function Add(vec_1 = new Vector(), vec_2 = new Vector())
    {
        return new Vector((vec_1.x + vec_2.x), (vec_1.y + vec_2.y),(vec_1.z + vec_2.z))
    }
/*
*	@brief Класс описывающий линию, имеет начало, конец и нормали.
*/
class Line
    {
        V0 = new Vector()	///< V0 - начальная точка
        V1 = new Vector()	///< V1 - точка конца
        N = new Vector()	///<
        vec = new Vector()	///< Пространственный вектор
        e_vec = new Vector()///< Постранственный единичный вектор

        constructor(start = new Vector(), end = new Vector())
            {
                this.V0.set_from_point(start);
                this.V1.set_from_point(end);

                var temp = Subtraction(end, start);
                this.vec.set_coordinates(temp.x,temp.y);
                this.e_vec.set_coordinates((temp.x/Math.sqrt(Math.pow(temp.x,2) + Math.pow(temp.y,2))), (temp.y/Math.sqrt(Math.pow(temp.x,2) + Math.pow(temp.y,2))));
            }
        set_coordinates(x0, y0, x1, y1, z0, z1)
            {
                this.V0.set_coordinates(x0,y0,z0);
                this.V1.set_coordinates(x1,y1,z1);

                var temp = Subtraction(this.V1, this.V0);
                this.vec = temp;
                this.e_vec.set_coordinates((temp.x/Math.sqrt(Math.pow(temp.x,2) + Math.pow(temp.y,2))), (temp.y/Math.sqrt(Math.pow(temp.x,2) + Math.pow(temp.y,2))));
            }
    }	
/*
*	@brief Класс, созданный для описания полигона.
*/
class Polygon {
        vertices = [] ///< Вершины, из которых состоит полигон
        uvs = []
        normals = []
        edges = [] ///< Грани, из которых состоит полигон

        /*
        *	@brief Функция вычисления нормали к плоскости полигона.
        */
        compute_normal()
            {
            }
        /*
        *
        */
        init_edges()
            {
                this.edges = [];
                for (let index = 0; index + 1 < this.vertices.length; index++)
                    {
                        this.edges.push(new Line(this.vertices[index],this.vertices[index + 1]))
                    }
                this.edges.push(new Line(this.vertices[this.vertices.length - 1],this.vertices[0]))
            }							
    }
/*
*	Класс, созданный для описания объекта.
*/
class Figure 
    {
        name = ""
        faces = []
        constructor(){}
    }

/*
* @brief Функция проверки принадлежности точки отрезку в пространстве.
*
* @return true, если точка принадлежит отрезку. Иначе false.
*/
function belongs(point = new Vector(),V0,V1)
    {
        let pline = Subtraction(point,V0); ///< Проверяемый отрезок
        let fline = Subtraction(V1, V0); ///< Полный отрезок
        let k = pline.x/fline.x;

        if ((k >= 0) && (k<=1) && (pline.y/fline.y == k) && (pline.z/fline.z == k))
            return true;

        return false;
    }
function cross(x0_1,y0_1,x1_1,y1_1,x0_2,y0_2,x1_2,y1_2)
    {
        let n;
        if (y1_1-y0_1 != 0)
            {
                let q = (x1_1 - x0_1)/(y0_1 - y1_1);
                let sn = (x0_2 - x1_2) + (y0_2 - y1_2)*q;
                if(sn == 0)
                    {
                        return undefined;
                    }
                let fn = (x0_2 - x0_1) + (y0_2 - y0_1)*q;
                n = fn/sn;
            }
        else
            {
                if(y0_2-y1_2 == 0)
                    {
                        return undefined;
                    }
                n = (y0_2 - y0_1) / (y0_2-y1_2);
            }
        return new Vector((x0_2 + (x1_2-x0_2)*n),(y0_2 + (y1_2-y0_2)*n));
    }
/*
*   @brief Класс отрисовки сцены
*/
class Scene
    {
        alpha = 0  ///< Угол вращения по оси x в радианах
        beta = 0    ///< Угол вращения по оси y радианах
        gamma = 0   ///< Угол вращения по оси z радианах

        objects = new Figure(); ///< Объект сцены

        draw(ctx, dx = 250, dy = 250, dalpha = 0.0, dbeta = 0.0, dgamma = 0.0, object = this.objects)
            {
                this.alpha += dalpha
                this.beta += dbeta
                this.gamma += dgamma

                if (this.alpha > Math.PI || this.alpha < 0)
                    {
                        this.alpha = Math.abs(this.alpha - Math.PI)
                    }
                if (this.beta > Math.PI || this.beta < 0)
                    {
                        this.beta = Math.abs(this.beta - Math.PI)
                    }
                if (this.gamma > Math.PI || this.gamma < 0)
                    {
                        this.gamma = Math.abs(this.gamma - Math.PI)
                    }
                
                for(let index = 0; index < object.faces.length; index++)
                    {
                        let CurrentFace = object.faces[index];
                        for (let ind_edge = 0; ind_edge < CurrentFace.edges.length; ind_edge++)
                            {
                                let CurrentEdge = new Line (CurrentFace.edges[ind_edge].V0,CurrentFace.edges[ind_edge].V1);

                                let rx = 0.0;
                                let ry = 0.0;
                                let rz = 0.0;
                                
                                rx = CurrentEdge.V0.x;
                                ry = Math.round(CurrentEdge.V0.y * Math.cos(dalpha) + CurrentEdge.V0.z * Math.sin(dalpha));
                                rz = Math.round(-1 * CurrentEdge.V0.y * Math.sin(dalpha) + CurrentEdge.V0.z * Math.cos(dalpha));

                                CurrentEdge.V0.set_coordinates(rx,ry,rz);

                                rx = CurrentEdge.V1.x;
                                ry = Math.round(CurrentEdge.V1.y * Math.cos(dalpha) + CurrentEdge.V1.z * Math.sin(dalpha));
                                rz = Math.round(-1 * CurrentEdge.V1.y * Math.sin(dalpha) + CurrentEdge.V1.z * Math.cos(dalpha));

                                CurrentEdge.V1.set_coordinates(rx,ry,rz)
                                /// Если повернули объект вокруг оси y, то используем матрицу поворота вокруг оси y
                                rx = Math.round(CurrentEdge.V0.x * Math.cos(dbeta) - CurrentEdge.V0.z * Math.sin(dbeta));
                                ry = CurrentEdge.V0.y;
                                rz = Math.round(CurrentEdge.V0.x * Math.sin(dbeta) + CurrentEdge.V0.z * Math.cos(dbeta));

                                CurrentEdge.V0.set_coordinates(rx,ry,rz);

                                rx = Math.round(CurrentEdge.V1.x * Math.cos(dbeta) - CurrentEdge.V1.z * Math.sin(dbeta));
                                ry = CurrentEdge.V1.y;
                                rz = Math.round(CurrentEdge.V1.x * Math.sin(dbeta) + CurrentEdge.V1.z * Math.cos(dbeta));

                                CurrentEdge.V1.set_coordinates(rx,ry,rz)
                                /// Если повернули объект вокруг оси z, то используем матрицу поворота вокруг оси z
                                rx = Math.round(CurrentEdge.V0.x * Math.cos(dgamma) + CurrentEdge.V0.y * Math.sin(dgamma));
                                ry = Math.round(CurrentEdge.V0.y * Math.cos(dgamma) - CurrentEdge.V0.x * Math.sin(dgamma));
                                rz = CurrentEdge.V0.z;

                                CurrentEdge.V0.set_coordinates(rx,ry,rz);

                                rx = Math.round(CurrentEdge.V1.x * Math.cos(dgamma) + CurrentEdge.V1.y * Math.sin(dgamma));
                                ry = Math.round(CurrentEdge.V1.y * Math.cos(dgamma) - CurrentEdge.V1.x * Math.sin(dgamma));
                                rz = CurrentEdge.V1.z;

                                CurrentEdge.V1.set_coordinates(rx,ry,rz)
                                //
                                Draw_Line(ctx, scale * CurrentEdge.V0.x + dx, scale * CurrentEdge.V0.y + dy, scale * CurrentEdge.V1.x + dx, scale * CurrentEdge.V1.y + dy)
                            }  
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
                        face.vertices.push(vertexList[parseInt(indeces[0]) - 1]);
                        
                        if (indeces[1] != "")
                            face.uvs.push(parseInt(indeces[1]) - 1);
                        
                        face.normals.push(parseInt(indeces[2]) - 1);
                    }
                else if (indeces.length == 2)
                    {
                        face.vertices.push(vertexList[parseInt(indeces[0]) - 1]);
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
                        object.faces.push(face);
                    } 
            }
        
        return object;
    }