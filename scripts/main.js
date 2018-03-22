$(document).ready(function () {
    $(function(){$('input[name=phone]').mask("+375(99)999-99-99", {placeholder:"_"});});

    $('.button').on('click', function (e) {
        e.preventDefault();
        $('.wrapper').find('.feedback-done').hide();
        $('.wrapper').find('.feedback').fadeIn();
        $('.wrapper').fadeIn(300);

        return false;
    });

    $('.close-button').on('click', function (e) {
        e.preventDefault();
        $('.wrapper').fadeOut(300);
    });

    $(document).on('keyup',function(e){
        if(e.which == 27){
            $('.wrapper').fadeOut(300);
        }
    });

    $(document).mouseup(function (e){
        var feedbackPopUpForm = $('.wrapper .feedback-pop-up');
        if (!feedbackPopUpForm.is(e.target) && feedbackPopUpForm.has(e.target).length === 0) {
            $('.wrapper').fadeOut(300);
        }
    });

    var lastScrollTop = 0;
    $(window).scroll(function(event){
        var st = $(this).scrollTop();
        if (st > lastScrollTop){
            $('.header-top').removeClass('fixed');
        } else {
            $('.header-top').addClass('fixed');
        }
        lastScrollTop = st;
    });

    var count = 12;

    var timer = setInterval(function () {

        if (count <= 10){
            $('.count span').css('color', '#c21517')
        }

        if(count !== 5){
            count--;
        }

        $('.count span').text(count);
    }, 30000);


    $('.submit-button').on( 'click', function(e) {

        e.preventDefault();

        var feedback = $(this).closest('.feedback');
        var feedbackDone = $(this).closest('.feedback').siblings('.feedback-done');

        var name = feedback.find('input[name=name]').val();
        var phone = feedback.find('input[name=phone]').val();

        if (name!== '' && phone !== ''){
            $('.submit-button').prop('disabled', true);

            var trackerReferrer = "";

            if( document.referrer.indexOf( "nonames.by" ) != -1 ){
                trackerReferrer = document.referrer;
            };

            _rc('send', 'order', {
                'name': name,
                'phone': phone,
                'customTransactionId': url('?transaction_id'),
                'customReferrer': trackerReferrer,
                'orderMethod': 'feedback',
                'callback': function(success, response) {

                    // уведомляем пользователя о результате отправки формы
                    // вместо alert() можно вывести более юзер-френдли сообщение
                    if (success) {

                        $.post("http://nonames.by/set_products_to_order.php", {
                                site: "kylie-time2-by",
                                order_id: response.id,
                                products: [ {id: productId, quantity: 1}, {id: 211, quantity: 1} ]
                            },

                            function( result ){
                                console.log(result);
                                $('.submit-button').prop('disabled', false);

                                feedback.fadeOut(100);
                                feedbackDone.fadeIn(300);

                                setTimeout(function () {
                                    $('.wrapper').fadeOut(300);
                                }, 2000);
                            });
                    }else{
                        alert('К сожалению, не удалось отправить заявку.');
                    }
                }
            });
        } else {
            $('input[name=name]').css('border-bottom', '1px solid red');
            $('input[name=phone]').css('border-bottom', '1px solid red');
        }

        return false;
    })
});