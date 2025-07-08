// HTML 문서의 모든 내용이 로드되면 이 안의 코드를 실행합니다.
document.addEventListener("DOMContentLoaded", () => {
  // 1. 필요한 HTML 요소들을 가져옵니다.
  const carouselTrack = document.querySelector(".carousel-track");
  const prevBtn = document.querySelector(".carousel-nav.prev");
  const nextBtn = document.querySelector(".carousel-nav.next");
  let carouselItems = document.querySelectorAll(".carousel-item"); // 아이템 복제 후 다시 선택하기 위해 'let'으로 변경

  if (!carouselTrack || carouselItems.length === 0 || !prevBtn || !nextBtn) {
    console.warn(
      "캐러셀 요소가 없거나 아이템이 없습니다. 캐러셀 기능이 활성화되지 않습니다."
    );
    return;
  }

  // --- 무한 루프 설정 시작 ---
  const originalItemCount = carouselItems.length; // 원본 아이템 개수 저장
  // 캐러셀의 첫 번째 아이템과 마지막 아이템을 복제하여 추가합니다.
  // 이렇게 하면 양 끝에서 끊김 없이 자연스럽게 순환하는 효과를 줄 수 있습니다.
  const firstItemClone = carouselItems[0].cloneNode(true); // 첫 번째 아이템 복제
  const lastItemClone = carouselItems[originalItemCount - 1].cloneNode(true); // 마지막 아이템 복제

  carouselTrack.appendChild(firstItemClone); // 복제된 첫 번째 아이템을 트랙의 맨 뒤에 추가
  carouselTrack.insertBefore(lastItemClone, carouselItems[0]); // 복제된 마지막 아이템을 트랙의 맨 앞에 추가

  // 복제된 아이템을 포함하여 모든 캐러셀 아이템을 다시 선택합니다.
  carouselItems = document.querySelectorAll(".carousel-item");
  const totalItemCount = carouselItems.length; // (원본 아이템 개수 + 2)

  // 초기 인덱스를 1로 설정하여, 실제 첫 번째 아이템(복제된 마지막 아이템 다음)이 보이도록 합니다.
  let currentIndex = 1;
  // --- 무한 루프 설정 끝 ---

  // 자동 재생 관련 변수
  let autoPlayInterval;
  const autoPlayDelay = 3000; // 3초마다 자동 회전

  // 3. 캐러셀의 위치를 업데이트하고 활성화된 아이템을 표시하는 함수
  // smoothTransition 매개변수를 추가하여 순간 이동 시 전환 효과를 끌 수 있도록 합니다.
  function updateCarousel(smoothTransition = true) {
    const itemWidth = carouselItems[0].offsetWidth; // 아이템의 실제 너비
    const itemStyle = getComputedStyle(carouselItems[0]); // CSS 스타일 정보
    const itemMarginLeft = parseFloat(itemStyle.marginLeft); // 왼쪽 마진
    const itemMarginRight = parseFloat(itemStyle.marginRight); // 오른쪽 마진
    const itemTotalWidth = itemWidth + itemMarginLeft + itemMarginRight; // 아이템 총 너비

    const wrapperWidth = carouselTrack.parentElement.offsetWidth; // 부모 컨테이너 너비
    const centerOffset = wrapperWidth / 2 - itemWidth / 2; // 중앙 정렬을 위한 오프셋

    const transformX = centerOffset - currentIndex * itemTotalWidth; // 이동할 최종 거리 계산

    // 전환 효과 적용 여부 결정
    if (smoothTransition) {
      carouselTrack.style.transition = `transform 0.5s ease-in-out`; // 부드러운 전환 효과
    } else {
      carouselTrack.style.transition = `none`; // 전환 효과 없이 즉시 이동
    }
    carouselTrack.style.transform = `translateX(${transformX}px)`; // 트랙 이동

    // 3-3. 활성화된 아이템에 'active' 클래스를 추가하고 나머지는 제거합니다.
    // 복제된 아이템이 아닌 실제 아이템(인덱스 1부터 originalItemCount까지)에만 active 클래스를 적용합니다.
    carouselItems.forEach((item, index) => {
      if (index === currentIndex && index >= 1 && index <= originalItemCount) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // 3-4. '이전'/'다음' 버튼의 활성화/비활성화 상태를 업데이트합니다.
    // 무한 루프이므로 버튼 비활성화 로직은 제거합니다.
    // prevBtn.disabled = currentIndex === 0;
    // nextBtn.disabled = currentIndex === carouselItems.length - 1;
  }

  // 자동 재생 시작 함수
  function startAutoPlay() {
    stopAutoPlay(); // 기존 자동 재생 인터벌이 있다면 중지
    autoPlayInterval = setInterval(() => {
      currentIndex++; // 다음 아이템으로 이동
      updateCarousel(); // 캐러셀 업데이트
    }, autoPlayDelay);
  }

  // 자동 재생 중지 함수
  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval); // 인터벌 클리어
    }
  }

  // 전환이 끝났을 때 이벤트를 감지하여 무한 루프 점프를 처리합니다.
  carouselTrack.addEventListener("transitionend", () => {
    // 복제된 첫 번째 아이템(맨 끝에 있는)으로 이동했을 경우
    if (currentIndex === totalItemCount - 1) {
      currentIndex = 1; // 실제 첫 번째 아이템으로 인덱스 변경 (순간 이동)
      updateCarousel(false); // 전환 없이 이동
    }
    // 복제된 마지막 아이템(맨 앞에 있는)으로 이동했을 경우
    else if (currentIndex === 0) {
      currentIndex = originalItemCount; // 실제 마지막 아이템으로 인덱스 변경 (순간 이동)
      updateCarousel(false); // 전환 없이 이동
    }
    // 전환이 끝난 후, 자동 재생이 활성화 상태였다면 다시 시작합니다.
    // (수동 조작으로 인해 잠시 멈췄던 경우를 대비)
    if (autoPlayInterval) {
      // autoPlayInterval이 정의되어 있을 때만 실행 (자동 재생이 활성화된 상태였음을 의미)
      startAutoPlay();
    }
  });

  // 4. '이전' 버튼 클릭 이벤트 리스너
  prevBtn.addEventListener("click", () => {
    stopAutoPlay(); // 수동 조작 시 자동 재생 일시 중지
    currentIndex--; // 인덱스 감소
    updateCarousel(); // 캐러셀 업데이트
  });

  // 5. '다음' 버튼 클릭 이벤트 리스너
  nextBtn.addEventListener("click", () => {
    stopAutoPlay(); // 수동 조작 시 자동 재생 일시 중지
    currentIndex++; // 인덱스 증가
    updateCarousel(); // 캐러셀 업데이트
  });

  // 6. 초기 로드 시 캐러셀을 한 번 업데이트하여 올바른 위치와 상태로 시작하게 합니다.
  // 전환 효과 없이 초기 위치를 설정하고 바로 자동 재생을 시작합니다.
  updateCarousel(false); // 초기 로딩 시 즉시 위치 설정 (부드러운 전환 없이)
  startAutoPlay(); // 페이지 로드 후 자동 재생 시작

  // 7. 창 크기가 변경될 때 캐러셀을 다시 계산하고 업데이트합니다. (반응형 웹 대응)
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer); // 기존 타이머가 있으면 취소
    resizeTimer = setTimeout(() => {
      // 0.25초(250ms) 후에 updateCarousel 함수 실행
      updateCarousel();
    }, 250);
  });
});
