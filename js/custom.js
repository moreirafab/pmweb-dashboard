//formata os numeros
function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

//donutscharts da home
 function montaGrafico(id, cor) {
  $(id).easyPieChart({
    size:125,
    scaleColor:false,
    barColor: cor,
    lineWidth: 13,
    trackColor: '#1a1a1a',
    lineCap: 'circle',
  });
}
function preencheCampoGrafico(dados, nomeBloco){
  $("#numero-inbound-" + nomeBloco).text(formatNumber(dados.inbound));
  $("#numero-outbound-" + nomeBloco).text(formatNumber(dados.outbound));
  $("#numero-grafico-" + nomeBloco + " p").text(formatNumber(dados.healthstatus));
  $("#numero-porcento-" + nomeBloco + " p").text(formatNumber(dados.difference));
  $("#numero-grafico-" + nomeBloco).attr("data-percent", (dados.healthstatus));

  //formata os numeros do ajax
  var numeroPorCento = parseInt(dados.difference);

  //modifica o background dos botões de diferença
  if (numeroPorCento > 0) {
    $('#numero-porcento-' + nomeBloco).addClass('verde-por-cento');
    montaGrafico("#numero-grafico-" + nomeBloco, "#3ab34d")

  }
  else {
    $('#numero-porcento-' + nomeBloco).addClass('vermelho-por-cento');
    montaGrafico("#numero-grafico-" + nomeBloco, "#efc82a")
    $('#seta-diferenca-' + nomeBloco).removeClass('fa-caret-up');
    $('#seta-diferenca-' + nomeBloco).addClass('fa-caret-down');
  }
}

$.ajax({
  url:'http://pmweb.agencia.pmweb.com.br/teste-frontend/api/intranet/campaigns.json',
  dataType:'json',
  method:'GET',
  complete: function(resultado){
    var dados = JSON.parse(resultado.responseText);
    preencheCampoGrafico(dados, 'campanha');
  }
});

$.ajax({
  url:'http://pmweb.agencia.pmweb.com.br/teste-frontend/api/intranet/notification.json',
  dataType:'json',
  method:'GET',
  complete: function(resultado){
    var dados = JSON.parse(resultado.responseText);
    preencheCampoGrafico(dados, 'notificacao');
  }
});

$.ajax({
  url:'http://pmweb.agencia.pmweb.com.br/teste-frontend/api/intranet/transaction.json',
  dataType:'json',
  method:'GET',
  complete: function(resultado){
    var dados = JSON.parse(resultado.responseText);
    preencheCampoGrafico(dados, 'transaction');
  }
});


var dadosGrafico = [];
dadosGrafico.push(['Hora', 'Média', 'Ontem', 'Hoje']);


function montaGraficoPrincipal(dadosGrafico){
  console.log(window.screen.width);
  if(window.screen.width <= 991){
    var line = 1;
    var showTextEvery = 11;
    var cordXResponsive = 3;
  }else{
    var line = 3;
    var showTextEvery = 1;
    var cordXResponsive = 15;
  }
  //Gráfico maior da home
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart);
  function drawChart() {
    var data = google.visualization.arrayToDataTable(dadosGrafico);
    var options = {
      backgroundColor: 'transparent',
      curveType: 'function',
      series: [{'color': '#F1CA3A'}],
      intervals: { 'style':'area', 'color':'series-color' },
      legend: {
        position: 'none'
      },
      hAxis: {
        showTextEvery: showTextEvery,
        textStyle:{
          color: '#999999',
          fontSize: 11,
          fontName:'Gotham',
        },
      },
      vAxis: {
        viewWindowMode:'explicit',
        viewWindow: {
          min:0,
          max:16000
        },
        ticks: [0, 4000, 8000, 12000, 16000],
        format: ' ',
        textStyle:{
          color: '#999999',
          fontSize: 11,
          fontName:'Gotham',
        },
        gridlines: {
          count: 6,
          color: '#2d2d2d'
        },

        minorGridlines:{
          count:0
        },
      },
      series: {
        0: {
          backgroundColor: '#ff0000',
          color: '#444444',
          lineWidth: line,
          type: 'area'
        },
        1: {
          color: '#269fbd',
          backgroundColor: 'transparent',
          lineWidth: line,
        },
        2: {
          color: '#7641cb',
          lineWidth: line,
        }
      },
      focusTarget: 'category',
      chartArea: {
        top: 8,
        bottom: 40,
        left: 60,
        right: 10,
        width: '100%',
        height: '100%'
      },
    };
    var chart = new google.visualization.ComboChart(document.getElementById('line-grafico'));
    google.visualization.events.addListener(chart, 'ready', function () {
    var labels = document.getElementsByTagName('text');
    Array.prototype.forEach.call(labels, function(label) {

      // move axis labels
      if (label.getAttribute('text-anchor') === 'end') {
        var xCoord = parseFloat(label.getAttribute('x'));
        label.setAttribute('x', xCoord - cordXResponsive);
      }
      if (label.getAttribute('text-anchor') === 'middle') {
        var yCoord = parseFloat(label.getAttribute('y'));
        label.setAttribute('y', yCoord + 15);
      }
    });
  });
    chart.draw(data, options);
  }
}

$.ajax({
  url:'http://pmweb.agencia.pmweb.com.br/teste-frontend/api/intranet/healthstatus.json',
  dataType:'json',
  method:'GET',
  complete: function(resultado){
    var dados = JSON.parse(resultado.responseText);
    console.log(dados.chartdata);
    dados.chartdata.map(function(conteudo, numero){
      dadosGrafico.push([conteudo.hora + 'h', conteudo.media, conteudo.ontem, conteudo.hoje]);
    });
    console.log(dadosGrafico);
    montaGraficoPrincipal(dadosGrafico);
  }
});
$(window).resize(function(){
  montaGraficoPrincipal(dadosGrafico);
});
