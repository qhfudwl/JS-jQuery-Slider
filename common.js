let liLength = $("#imgList li").length // 리스트 개수
let liWidth = $("#imgList li").width() // 슬라이드 1개 너비
let totalWidth = liLength*liWidth // 슬라이드 리스트 총 너비
let cNum = 0; // 숫자 버튼에 class 를 부여할 index 번호
// 코드 상의 index 번호를 따르는 리스트
const li = document.querySelectorAll("#imgList li")
let startPos; // 리스트가 유지해야할 위치
let timer; // setInterval, clearInterval
$("#imgList").css({width: totalWidth}) // 리스트 총 너비 대입
// a 태그 배경으로 가상 속성 data를 이용해 이미지 삽입
for (let i=0; i<liLength; i++) {
    let imgPath = $("#imgList li").eq(i).data("path")
    $("#imgList li").eq(i).children().css("background-image", "url(" + imgPath + ")")
}
// 기본 구조 ---------------------------------------------------------
// 4 5 6 0 1 2 3 , 리스트 위치 잡기
// 길이 / 2 를 올림한것까지 해서 그 수만큼 가장 앞의 요소를 가장 뒤로 보낸다
for (let i=0; i<Math.ceil(liLength/2); i++) {
    $("#imgList").append($("#imgList li:first"))
}
startPos = -liWidth * Math.floor(liLength/2) // 유지해야할 위치
$("#imgList").css({left: startPos}) // 리스트에 위치 대입
//---------------------------------------------------------------------

// - 방향으로 이동, > 클릭 시
function nextSlide() {
    // - 방향으로 이동 완료 후, 구조 및 위치 변경
    // 리스트가 움직이지 않을 때 동작해야한다.
    $("#imgList:not(:animated)").animate({left: "-=" + liWidth}, function() {
        $(this).append($("#imgList li:first")).css({left: startPos})
        btnOn()
    })
}
// + 방향으로 이동, < 클릭 시
function prevSlide() {
    // + 방향으로 이동 완료 후, 구조 및 위치 변경
    // 리스트가 움직이지 않을 때 동작해야한다.
    $("#imgList:not(:animated)").animate({left: "+=" + liWidth}, function() {
        $(this).prepend($("#imgList li:last")).css({left: startPos})
        btnOn()
    })
}
// btnOn 함수
function btnOn() {
    // 리스트 중 현재 보여지고 있는 위치의 리스트의 클래스명
    let cName = $("#imgList li:eq(3)").attr("class")
    // 클래스명을 숫자로 표시했기때문에 그 숫자를 가지고온다.
    cNum = parseInt(cName[cName.length-1])-1
    $("#btnWrap a").removeClass("active") // 우선 각 버튼 class 제거
    $("#btnWrap a").eq(cNum).addClass("active") // 그 후, 가지고온 숫자로 class 적용
}
// a 태그 클릭 시 기본 값 취소, setInterval 멈추기
$("#arrowWrap a, #btnWrap a").on("click", function(e) {
    e.preventDefault();
    clearInterval(timer)
    timer = setInterval(nextSlide, 4000)
})
// < 클릭 시
$("#arrowWrap a:first").on("click", function() {
    prevSlide()
})
// > 클릭 시
$("#arrowWrap a:last").on("click", function() {
    nextSlide()
})
// btn 클릭 시 이동
$("#btnWrap a").on("click", function() {
    let iNum = $(this).index() // 누른 버튼 index 값 가지고 오기
    /*
        javascript 로 누른 버튼의 index 번호에 해당하는 리스트 위치 알아내기
        하지만 offsetLeft 이기 때문에 요소를 기준 0px 부터 시작하기 때문에
        -를 붙여서 목표 위치로 대입

        버튼 index  	js위치  	버튼 클릭	이동할 위치
            0	        1500    	0 클릭	    -1500
            1	        2000    	1 클릭	    -2000
            2	        2500    	2 클릭	    -2500
            3	        3000    	3 클릭  	-3000
            4	        0	        4 클릭  	0
            5	        500     	5 클릭  	-500
            6	        1000    	6 클릭  	-1000
    */
    let targetPos = -li[iNum].offsetLeft
    // 알아낸 위치로 이동 완료 후 구조, 위치 변경
    // 리스트가 움직이지 않을 때 동작해야한다.
    $("#imgList:not(:animated)").animate({left: targetPos}, function() {
        // 현재 슬라이드의 위치를 알아낸다.
        let presentPos = parseInt($("#imgList").css("left"))
        /*
            슬라이드가 기본 위치인 -1500 으로 가기 위해서
            구조를 몇 번 변경해야하는 지 알아낸다.

            현재 left 값		구조 변경      	   +1500	 abs()	   /500
                -1500 보다 큰

            0           가장 뒤의 것 3번 앞으로	    +1500	  1500	    3
            -500        가장 뒤의 것 2번 앞으로	    +1000	  1000	    2
            -1000       가장 뒤의 것 1번 앞으로	    +500	  500	    1

            -1500       필요 없음	        	    0	      0	       0

                -1500 보다 작은

            -2000       가장 앞의 것 1번 뒤로	    -500	  500	    1
            -2500       가장 앞의 것 2번 뒤로	    -1000	  1000	    2
            -3000       가장 앞의 것 3번 뒤로	    -1500	  1500	    3
        */
        let moveTime = Math.abs(presentPos + 1500) / 500
        if (presentPos > -1500) {
            for (let i=0; i<moveTime; i++) {
                $("#imgList").prepend($("#imgList li:last"))
            }
        }
        else if (presentPos < -1500) {
            for (let i=0; i<moveTime; i++) {
                $("#imgList").append($("#imgList li:first"))
            }
        }
        // 구조 변경 후 위치를 기본 위치로 이동
        $("#imgList").css("left", startPos)
        btnOn()
    })
})
// setInterval
timer = setInterval(nextSlide, 4000)