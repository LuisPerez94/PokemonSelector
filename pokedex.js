	$(document).ready(function(){
		var tipos= {
			"Pasto":"00B16A",
			"Veneno":"663399",
			"Fuego":"EC644B",
			"Volador":"E67E22",
			"Acuatico":"22A7F0",
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
			$('#exampleModal').on('show.bs.modal', function (event) {
			  var tarjeta = $(event.relatedTarget) // Button that triggered the modal
			  var index = tarjeta.data('whatever') // Extract info from data-* attributes
			  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
			  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
			  var modal = $(this)
			  modal.find('.nombre_modal').text(datos["pokemon"][index]["name"]);
			  modal.find('.img_modal').attr("src",datos["pokemon"][index]["img"]);
			  //modal.find('.img-modal').attr("src","img/"+datos.Laboratorios[index].Img);
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
			    if($("#"+index).hasClass("atrapado"))
				{
					$('#atrapalo').text("Dejar libre");
				}else{
					$('#atrapalo').text("Atrapar");
				}

			    $('#atrapalo').attr("name",index);

			});

		$("#atrapalo").click(function(e){
			e.preventDefault();
			var index=$('#atrapalo').attr("name");
			$("#exampleModal").modal('hide');
			$("#"+ $(this).attr("name")).toggleClass("atrapado");
			if($("#"+ $(this).attr("name")).hasClass("atrapado"))
			{
				crearCookie(index,escape(datos["pokemon"][index]["name"]));
			}else{
				eliminarCookie(index);
			}

		});

		$('#filtrar').on("input",function(){
                    var rex = new RegExp($(this).val(),'i');
                    $objPokemones=datos.pokemon.filter(function(el){ 
                        return getNombre(el,rex)
                    });
                	
                	$("#pokemon-container").empty();
                    crear_catalogo($objPokemones,tipos);
                });
	    
			function getNombre(dato,rex){
		        return rex.test(dato.name);
            }
		
		$.getJSON("pokedex.json",function(value){
			datos=value;
			llenar_dropdowns(tipos);
			crear_catalogo(datos["pokemon"],tipos);
			
			

		});
		
		

	});

	function llenar_dropdowns(tipos)
	{
		
			
			$.each(tipos,function(index,value)
			{
				
				$("#tipo").append("<li><a href='#'>"+index+"</a></li>");
				$("#debilidad").append("<li><a href='#'>"+index+"</a></li>");

			});
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
var crearCookie = function (key, value) {
    expires = new Date();
    expires.setTime(expires.getTime() + 31536000000); // Estableces el tiempo de expiración, genius
    cookie = key + "=" + value + ";expires=" + expires.toUTCString();
    return document.cookie = cookie;
}

// Leer Cookie
var atraparPokemones = function () {
    var pokemones = document.cookie.split(";");
    $.each(pokemones,function(index,value){
    	var valor = value.substring(0,value.indexOf("="));
    	$("#"+valor.trim()).addClass("atrapado");
    });
}

// Eliminar Cookie
var eliminarCookie = function (key) {
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
