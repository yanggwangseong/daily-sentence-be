import { Instant, ZoneId, ZonedDateTime } from "@js-joda/core";
import "@js-joda/timezone";

/**
 * 날짜를 한국 시간대로 변환하는 함수
 * @author 양광성
 * @description 날짜를 한국 시간대로 변환하는 함수
 * @param date 날짜
 * @returns 한국 시간대로 변환된 날짜 (YYYY-MM-DD)
 */
export const toKoreanLocalDateString = (date: Date): string =>
    ZonedDateTime.ofInstant(
        Instant.ofEpochMilli(date.getTime()),
        ZoneId.of("Asia/Seoul"),
    )
        .toLocalDate()
        .toString();
