
window.go = true;
window.debug = false;

let START_DATE = Date();
let CONTACTS = $('.mn-pymk-list__card');
let EXCLUDE_LIST = new Set();
let LAST_EXCLUDE_LEN = 0;
let MAX_EXCLUDE_LIST_SIZE = 120;
let NEW_FRENDS = [];
let EXCEPT_POSITIONS = [
    'recruitment', 'recruiter', 'hr', 'recruiting', 'head', 'lead', 'cio', 'cto', 'founder'
];
let LOOP_INTERVAL = 4000;
let LOOP_LEN = 0;
let CHECK_USER;

function check_exclude(_id) {
    return EXCLUDE_LIST.has(_id);
}

function list_content(object, list) {
    let res = list.indexOf(object);
    if (res >= 0){
        return true
    }
    return false
}
function check_position(position) {
    var result = false;
    position.forEach(function(element) {
      if (list_content(element, EXCEPT_POSITIONS)){
          result = true;
      }
    });
    return result;
}

function remove_contact(_id) {
    $('#'+_id).parent().remove();
    EXCLUDE_LIST.delete(_id);
}

function check_blocking() {
    let result = false;
    if(CHECK_USER && $('#'+CHECK_USER).length > 0) {
        result = true;
    }
    CHECK_USER = false;
    return result
}

function check_stuck() {
    let result = false;
    if(LAST_EXCLUDE_LEN === EXCLUDE_LIST.size) {
        result = true;
    }
    return result
}

function move() {
    if (window.go){
        LAST_EXCLUDE_LEN = EXCLUDE_LIST.size;
        CONTACTS = $('.mn-pymk-list__card');
        for(var contact=0; contact<CONTACTS.length; contact++){
            write_log('FIELD');
            let field = CONTACTS[contact].children[0];
            write_log(field);

            write_log('ID');
            let _id = CONTACTS[contact].children[0].getAttribute('id');
            write_log(_id);

            write_log('NAME');
            let _name = $(field.children[2].children[0].children[1]).text();
            write_log(_name);

            write_log('BUTTON');
            let _button = field.children[3].children[0];
            write_log(_button);

            write_log('POSITION');
            let _position = $(field.children[2].children[0].children[3]).text().toLowerCase().split(' ');
            write_log(_position);

            write_log('INT_FIELD');
            let _int = 0;
            let _int_field;
            try {
                _int_field = $(field.children[2].children[1].children[0].children[1]).text();
                let reg = /\d+/g;
                _int = parseInt(_int_field.match(reg)[0]);
            } catch(err){}
            write_log(_int_field);

            if (check_position(_position) || _int && _int < 30){
                write_log('===============GOOD_FREND_INT===============');
                write_log(_int);
                if (!check_exclude(_id)){
                    NEW_FRENDS.push(_name);
                    CHECK_USER = _id;
                    console.log(_name);
                    console.log(_int);
                    _button.click();

                } else {
                    write_log('EXCLUDED');
                    write_log(_id)
                }

            }
            EXCLUDE_LIST.add(_id);
        }
        finish_loop();
    }
}

function finish_loop() {
    setTimeout(function(){
          if (!check_blocking() && !check_stuck()){
                scrole();
                setTimeout(function(){list_erase()}, 1000);
            } else {
                stop()
            }

            LOOP_LEN += 1;
        }, 3000
    );
}

window.setInterval(move, LOOP_INTERVAL);
window.setInterval(function () {
    console.log('NEW CONTACTS: ' + NEW_FRENDS.length);
}, LOOP_INTERVAL*10);

function stop() {
    window.go=false;
    get_statistic()

}

function list_erase() {
    let iterator = EXCLUDE_LIST.values();
    let iteration_max = 11;
    while (EXCLUDE_LIST.size > MAX_EXCLUDE_LIST_SIZE && iteration_max > 0 ){
        remove_contact(iterator.next().value);
        iteration_max -= 1;
    }
}


function write_log(field) {
    if (window.debug){
        console.log(field)
    }
}

function scrole() {
    $(window).scrollTop(-$(document).height());
    setTimeout(function(){$(window).scrollTop($(document).height());}, 500);
}


function get_statistic() {
    let stop_date = Date();
    console.log('LOOP_LEN: ' + LOOP_LEN);
    console.log('NEW CONTACTS: ' + NEW_FRENDS.length);
    console.log('EXCLUDE_LIST: ' + EXCLUDE_LIST.size);
    console.log('START DATE: ' + START_DATE);
    console.log('STOP DATE: ' + stop_date);
    console.log('check_blocking: ' + check_blocking());
    console.log('check_stuck: ' + check_stuck())
}