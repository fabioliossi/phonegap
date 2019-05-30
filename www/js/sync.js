$( document ).ready(function() {


 sync();


});

function sync()
{

  var $user_id = 0;
  var $kit_id = 0;

  db.transaction(function(tx){

    tx.executeSql("SELECT * FROM user LIMIT 1;",[],function(tx1,result){

      $user_id= result.rows[0].user_id;

    });

    tx.executeSql("SELECT kit_id FROM kit WHERE acerto = 'N' LIMIT 1;",[],function(tx1,result){

      $kit_id= result.rows[0].kit_id;

    });



    tx.executeSql("SELECT (SELECT user_id FROM user LIMIT 1) as user_id, id, data_criacao,data_finalizacao,finalizada FROM venda WHERE finalizada='S';",[],function(tx1,result){

      $vendas= JSON.stringify(result.rows);

    });

    tx.executeSql("SELECT * FROM venda_produto WHERE ativo=1;",[],function(tx1,result){

      $produtos= JSON.stringify(result.rows);

    });

  },// Caso erro
  function($err)
  {
    console.log($err);
  },// Caso Sucesso
  function()
  {
     var $url_send = 'http://vendadireta.grupoornatus.com/api/syncSales/'+$kit_id+'/'+$user_id;
  //  var $url_send = 'http://localhost/venda_direta/public/api/syncSales/'+$kit_id+'/'+$user_id;

    $.ajax({
      url: $url_send,
      type: 'GET',
      async:false,
      data: { produtos:$produtos, vendas:$vendas  },
      success: function(data, textStatus, xhr)
      {


      },
      error: function(xhr, status, error)
      {

      }

    });
  }
);

}
