	$(document).ready(function(){
		var tipos= {
			"Hierba":"00B16A",
			"Veneno":"663399",
			"Fuego":"EC644B",
			"Volador":"E67E22",
			"Agua":"22A7F0",
			"Bicho":"26A65B",
			"Normal":"F7CA18",
			"Electrico":"F4D03F",
			"Tierra":"96281B",
			"Pelea":"F9BF3B",
			"Psiquico":"E08283",
			"Roca":"95A5A6",
			"Hielo":"3A539B",
			"Fantasma":"22313F",
			"Dragon":"EF4836",
			"Siniestro":"141414"
		};
		var datos;
		//modal
		$('#exampleModal').on('show.bs.modal', function (event) {
		  var tarjeta = $(event.relatedTarget); 
		  var index = tarjeta.data('whatever');  //index
		  var modal = $(this);

		  modal.find('.nombre_modal').text(datos["pokemon"][index]["name"]);
		  modal.find('.img_modal').attr("src",datos["pokemon"][index]["img"]);
		  
		  modal.find('.perfil_modal').empty();
		  modal.find('.perfil_modal').append("<p>Peso: "+datos["pokemon"][index]["weight"]+"</p>");
		  modal.find('.perfil_modal').append("<p>Altura: "+datos["pokemon"][index]["height"]+"</p>");
		  modal.find('.perfil_modal').append("<p>Huevo a los : "+datos["pokemon"][index]["egg"]+"</p>");
		  
		  modal.find('.tipos_modal').empty();
		  $.each(datos["pokemon"][index]["type"],function(index,value)
          {	
   				var $tagTipo=$("<span></span>");
   				$tagTipo.append(value);
   				$tagTipo.css({"margin-left":"5px","background-color":"#"+tipos[value],"color":"white","padding":"3px","border-radius":"4px"});
   				modal.find('.tipos_modal').append($tagTipo);
          });

		  modal.find('.debilidades_modal').empty();
		  $.each(datos["pokemon"][index]["weaknesses"],function(index,value)
			{	
				var $tagTipo=$("<span></span>");
				$tagTipo.append(value);
				$tagTipo.css({"margin-left":"5px","background-color":"#"+tipos[value],"color":"white","padding":"3px","border-radius":"4px"});
				modal.find('.debilidades_modal').append($tagTipo);
			});

		  modal.find('.evoluciones_anteriores_modal').empty();
		  $.each(datos["pokemon"][index]["prev_evolution"],function(index,value)
			{	
				var $img=$("<img/>");
				$img.attr({"src":datos["pokemon"][parseInt(value["num"]-1)]["img"]});
				$img.css({"class":"img-responsive","width":"50px"});
				modal.find('.evoluciones_anteriores_modal').append($img);
			});

		   modal.find('.evoluciones_siguientes_modal').empty();
		    $.each(datos["pokemon"][index]["next_evolution"],function(index,value)
   			{	
   				var $img=$("<img/>");
   				$img.attr("src",datos["pokemon"][parseInt(value["num"]-1)]["img"]);
   				$img.css({"class":"img-responsive","width":"50px"});
   				modal.find('.evoluciones_siguientes_modal').append($img);
   			});

   			//boton
		    if($("#"+index).hasClass("atrapado"))
			{
				$('#atrapalo').text("Dejar libre");

			}else{
				$('#atrapalo').text("Atrapar");

			}

		    $('#atrapalo').attr("name",index);

		});

		//boton
		$("#atrapalo").click(function(e){ 
			e.preventDefault();
			var index=$('#atrapalo').attr("name"); //obtengo el index del pokemon
			$("#exampleModal").modal('hide');
			$("#"+ index).toggleClass("atrapado"); 

			if($("#"+ index).hasClass("atrapado"))
			{
				crearCookie(index,escape(datos["pokemon"][index]["name"]));
			}else{
				eliminarCookie(index);
			}
		});


		$('#filtrar').on("input paste change propertychange",function()
		{
			var valores=$(this).val().split(":");
			if(valores.length<2){
		        var rex = new RegExp(valores[0],'i');
		        $objPokemones=datos.pokemon.filter(function(el){ 
		            return getNombre(el,rex)
		        });
		    	
		    	$("#pokemon-container").empty();
		        crear_catalogo($objPokemones,tipos);
	    	}
	    	else
	    	{
	    		var rex = new RegExp(valores[1],'i');
		        $objPokemones=datos.pokemon.filter(function(el){ 
		            return getValue(el,valores[0],rex)
		        });
		    	
		    	$("#pokemon-container").empty();
		        crear_catalogo($objPokemones,tipos);
	    	}

	    });

		$("#todos").click(function(e){
			e.preventDefault();
			$("#filtrar").val("");
			$("#filtrar").trigger("input");

			
		});

		$("#atrapados").click(function(e){
			e.preventDefault();
			$("#pokemon-container").empty();
			datosFiltrados=buscarAtrapados(datos);
			console.log(datosFiltrados["pokemon"]);
			crear_catalogo(datosFiltrados["pokemon"],tipos);

			
		});

		function getNombre(dato,rex)
		{
	        return rex.test(dato.name);
        }

        function getValue(dato,propiedad,rex)
        {
        	if (propiedad=="tipo") {
        		for(var i=0; i< dato["type"].length;i++)
        		{
        			if(rex.test(dato["type"][i]))
        			{
        				return true;
        			}
        		}

        	}
        	else
        	{
        		for(var i=0; i< dato["weaknesses"].length;i++)
        		{
        			if(rex.test(dato["weaknesses"][i]))
        			{
        				return true;
        			}
        		}
        	}

        	return false;
        }

		//obtener la info
		$.getJSON("pokedex.json",function(value){
			datos=value;
			llenar_dropdowns(tipos);
			crear_catalogo(datos["pokemon"],tipos);
		});
		
		

	});

function llenar_dropdowns(tipos)
{
	
	$.each(tipos,function(value,index)
	{
		
		$("#tipo").append("<li><a onclick='buscar(\"tipo\",\""+value+"\")'>"+value+"</a></li>");
		$("#debilidad").append("<li><a onclick='buscar(\"debilidad\",\""+value+"\")'>"+value+"</a></li>");

	});
}

function buscar(opc,tipo)
{
	$("#filtrar").val(opc+":"+tipo);
	$("#filtrar").trigger("input");
}

function crear_catalogo(datos,tipos) 
{

	var $contenedor = $("#pokemon-container");
	var numeroFilas=datos.length/4;
   	var pokemones=datos;
   	var sobra=datos.length-(parseInt(numeroFilas)*4);

   for(var i=0;i<parseInt(numeroFilas);i++)
   {	
   		var $nuevaFila=$("<div></div>");
   		$nuevaFila.attr("class","row");
   		for(var j=0;j<4;j++)
   		{
   			//creamos columnas
   			var $nuevaCol=$("<div data-whatever='"+(parseInt(pokemones[(4*i)+j]["num"])-1)+"' data-toggle='modal' data-target='#exampleModal' id='"+(parseInt(pokemones[(4*i)+j]["num"])-1)+"'></div>");
   			var $tipo=$("<div></div>");
   			$nuevaCol.attr("class","col-md-3 col-sm-3 col-xs-6 text-center tarjeta");

   			$nuevaCol.append("<div class='img cargador'><img data-src='"+ pokemones[(4*i)+j]["img"]+"' class='img-responsive post-carga center-block' /></div>");
   			$nuevaCol.append("<h4>"+pokemones[(4*i)+j]["name"]+"</h4>");
   			$.each(pokemones[(4*i)+j]["type"],function(index,value)
   			{	
   				var $tagTipo=$("<span></span>");
   				$tagTipo.append(value);
   				$tagTipo.css({"margin-left":"5px","background-color":"#"+tipos[value],"color":"white","padding":"3px","border-radius":"4px"});
   				$tipo.append($tagTipo);
   				$nuevaCol.append($tipo);

   			});

   			//agregamos a la fila
   			$nuevaFila.append($nuevaCol);
   		}
   		//agregamos al contenedor
   		$contenedor.append($nuevaFila);
   }

	var $nuevaFila=$("<div></div>");
	$nuevaFila.attr("class","row");

	for(var j=0;j<sobra;j++)
	{
		//creamos columnas
		var $nuevaCol=$("<div data-whatever='"+(parseInt(pokemones[parseInt((numeroFilas))*4+j]["num"])-1)+"' data-toggle='modal' data-target='#exampleModal' id='"+(parseInt(pokemones[parseInt((numeroFilas))*4+j]["num"])-1)+"'></div>");
		var $tipo=$("<div></div>");
		$nuevaCol.attr("class","col-md-3 col-sm-3 col-xs-6 text-center tarjeta");

		$nuevaCol.append("<div class='img cargador'><img data-src='"+ pokemones[(parseInt(numeroFilas)*4+j)]["img"]+"' class='img-responsive post-carga center-block' /></div>");
		$nuevaCol.append("<h4>"+pokemones[(parseInt(numeroFilas)*4+j)]["name"]+"</h4>");
		$.each(pokemones[(parseInt(numeroFilas)*4+j)]["type"],function(index,value)
		{	
			var $tagTipo=$("<span></span>");
			$tagTipo.append(value);
			$tagTipo.css({"margin-left":"5px","background-color":"#"+tipos[value],"color":"white","padding":"3px","border-radius":"4px"});
			$tipo.append($tagTipo);
			$nuevaCol.append($tipo);

		});

		//agregamos a la fila
		$nuevaFila.append($nuevaCol);
	}

	//agregamos al contenedor
	$contenedor.append($nuevaFila);
	cargarImagenes();
	atraparPokemones();
}

	// Crear Cookie
var crearCookie = function (key, value) 
{

    expires = new Date();
    expires.setTime(expires.getTime() + 31536000000); // Estableces el tiempo de expiración, genius
    cookie = key + "=" + value + ";expires=" + expires.toUTCString();
    return document.cookie = cookie;
}

// Leer Cookie
var atraparPokemones = function () 
{

    var pokemones = document.cookie.split(";");
    $.each(pokemones,function(index,value){
    	var valor = value.substring(0,value.indexOf("="));
    	$("#"+valor.trim()).addClass("atrapado");
    });
}

function buscarAtrapados(datos)
{
	 var pokemones = document.cookie.split(";");
	 var arreglo={
	 	"pokemon":new Array()
	 };
    $.each(pokemones,function(index,value){
    	var valor = value.substring(0,value.indexOf("="));

    	arreglo.pokemon.push(datos.pokemon[valor.trim()]);
    });
  
    return arreglo;
}

// Eliminar Cookie
var eliminarCookie = function (key) 
{
    return document.cookie = key + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
	   
function cargarImagenes()
{
    $(".post-carga").each(function(){
        $(this).attr('src', $(this).data('src')).on("load",function(){
            $(this).fadeIn();
            $(".cargador").css("background","none");

        });
    })  
}
