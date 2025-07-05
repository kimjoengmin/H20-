// HTML 문서의 모든 내용이 로드되면 이 안의 코드를 실행합니다.
document.addEventListener("DOMContentLoaded", () => {
  // 1. 필요한 HTML 요소들을 가져옵니다.
  // querySelector는 해당 선택자에 맞는 첫 번째 요소를 가져옵니다.
  // querySelectorAll은 해당 선택자에 맞는 모든 요소를 배열처럼 가져옵니다.

  const carouselTrack = document.querySelector(".carousel-track");
  // 학부/전공 카드들이 실제 움직이는 '레일' 역할을 하는 요소입니다.
  const prevBtn = document.querySelector(".carousel-nav.prev");
  // '이전' 버튼 (왼쪽 화살표) 요소입니다.
  const nextBtn = document.querySelector(".carousel-nav.next");
  // '다음' 버튼 (오른쪽 화살표) 요소입니다.
  const carouselItems = document.querySelectorAll(".carousel-item");
  // 각 학부/전공 카드 하나하나를 나타내는 요소들 (여러 개이므로 All을 사용)입니다.

  // 2. 만약 캐러셀을 구성하는 요소들이 없으면 (예: HTML에서 삭제되었거나 오타가 있다면)
  // JavaScript 오류를 내지 않고 기능을 비활성화합니다.
  if (!carouselTrack || carouselItems.length === 0 || !prevBtn || !nextBtn) {
    console.warn(
      "캐러셀 요소가 없거나 아이템이 없습니다. 캐러셀 기능이 활성화되지 않습니다."
    );
    return; // 함수를 여기서 종료하여 더 이상 코드를 실행하지 않습니다.
  }

  let currentIndex = 0; // 현재 중앙에 표시되어야 할 캐러셀 아이템의 '인덱스'를 나타냅니다.
  // 배열은 0부터 시작하므로, 첫 번째 아이템은 인덱스 0입니다.

  // 3. 캐러셀의 위치를 업데이트하고 활성화된 아이템을 표시하는 함수
  function updateCarousel() {
    // 3-1. 캐러셀 아이템의 너비와 마진을 동적으로 계산합니다.
    // CSS에서 고정된 값을 사용했더라도, JavaScript에서 다시 계산하면 더 유연하게 대응할 수 있습니다.
    const itemWidth = carouselItems[0].offsetWidth; // 첫 번째 아이템의 실제 너비 (패딩, 보더 포함)
    const itemStyle = getComputedStyle(carouselItems[0]); // 첫 번째 아이템에 적용된 CSS 스타일 정보를 가져옵니다.
    const itemMarginLeft = parseFloat(itemStyle.marginLeft); // 왼쪽 마진 값을 숫자로 변환하여 가져옵니다.
    const itemMarginRight = parseFloat(itemStyle.marginRight); // 오른쪽 마진 값을 숫자로 변환하여 가져옵니다.
    const itemTotalWidth = itemWidth + itemMarginLeft + itemMarginRight; // 아이템 하나가 차지하는 총 너비 (마진 포함)

    // 3-2. 캐러셀 트랙(레일)이 중앙에 오도록 이동할 거리를 계산합니다.
    const wrapperWidth = carouselTrack.parentElement.offsetWidth; // 캐러셀 트랙을 감싸는 부모 요소(.carousel-track-wrapper)의 너비
    // wrapperWidth / 2: 래퍼의 정중앙 지점
    // itemWidth / 2: 아이템의 정중앙 지점
    // centerOffset: 래퍼의 정중앙에 아이템의 정중앙이 오도록 하는 초기 위치
    const centerOffset = wrapperWidth / 2 - itemWidth / 2;

    // 현재 인덱스에 따라 트랙을 왼쪽으로 얼마나 이동시켜야 할지 계산합니다.
    // (현재 인덱스 * 아이템 총 너비) 만큼 왼쪽으로 이동하고, 거기에 중앙 정렬을 위한 offset을 더합니다.
    const transformX = centerOffset - currentIndex * itemTotalWidth;
    carouselTrack.style.transform = `translateX(${transformX}px)`; // CSS의 transform 속성을 사용하여 트랙을 이동시킵니다.

    // 3-3. 활성화된 아이템에 'active' 클래스를 추가하고 나머지는 제거합니다.
    carouselItems.forEach((item, index) => {
      // 모든 캐러셀 아이템을 순회합니다.
      if (index === currentIndex) {
        // 현재 인덱스와 일치하는 아이템이면
        item.classList.add("active"); // 'active' 클래스를 추가합니다. (CSS에서 active 클래스에 투명도, 크기 등을 설정)
      } else {
        // 일치하지 않으면
        item.classList.remove("active"); // 'active' 클래스를 제거합니다.
      }
    });

    // 3-4. '이전'/'다음' 버튼의 활성화/비활성화 상태를 업데이트합니다.
    // 첫 번째 아이템일 때는 '이전' 버튼 비활성화
    prevBtn.disabled = currentIndex === 0;
    // 마지막 아이템일 때는 '다음' 버튼 비활성화
    nextBtn.disabled = currentIndex === carouselItems.length - 1;
  }

  // 4. '이전' 버튼 클릭 이벤트 리스너
  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      // 현재 인덱스가 0보다 크면 (첫 번째 아이템이 아니면)
      currentIndex--; // 인덱스를 1 감소시키고
      updateCarousel(); // 캐러셀을 업데이트합니다.
    }
  });

  // 5. '다음' 버튼 클릭 이벤트 리스너
  nextBtn.addEventListener("click", () => {
    if (currentIndex < carouselItems.length - 1) {
      // 현재 인덱스가 마지막 아이템보다 작으면 (마지막 아이템이 아니면)
      currentIndex++; // 인덱스를 1 증가시키고
      updateCarousel(); // 캐러셀을 업데이트합니다.
    }
  });

  // 6. 초기 로드 시 캐러셀을 한 번 업데이트하여 올바른 위치와 상태로 시작하게 합니다.
  // 참고: DOMContentLoaded 시점에 이미지 로드가 완료되지 않아 아이템 너비가 0이 될 수 있습니다.
  // 이 경우, window.onload 이벤트에 updateCarousel()을 넣거나,
  // setTimeout으로 짧게 지연시키는 것이 더 안정적일 수 있습니다.
  updateCarousel();

  // 7. 창 크기가 변경될 때 캐러셀을 다시 계산하고 업데이트합니다. (반응형 웹 대응)
  let resizeTimer; // resize 이벤트가 너무 자주 발생하지 않도록 타이머 변수 선언
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer); // 기존 타이머가 있으면 취소
    resizeTimer = setTimeout(() => {
      // 0.25초(250ms) 후에 updateCarousel 함수 실행
      // 이렇게 하면 창 크기를 조절하는 동안 계속 함수가 실행되는 것을 방지하여 성능을 최적화합니다.
      updateCarousel();
    }, 250);
  });
});
