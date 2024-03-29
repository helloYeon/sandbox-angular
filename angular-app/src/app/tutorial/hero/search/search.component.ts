import { Component, OnInit } from '@angular/core';
import { Hero } from '../../../interfaces/hero';
import { HeroService } from '../../../services/hero.service';
import { Observable, Subject } from 'rxjs';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-hero-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  heroes$!: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) {}

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // 연속된 키입력을 처리하기 위해 300ms 대기합니다.
      debounceTime(300),

      // 이전에 입력한 검색어와 같으면 무시합니다.
      distinctUntilChanged(),

      // 검색어가 변경되면 새로운 옵저버블을 생성합니다.
      switchMap((aaaTerm: string) => this.heroService.searchHeroes(aaaTerm))
    );
  }

  // 사용자가 입력한 검색어를 옵저버블 스트림으로 보냅니다.
  search(term: string): void {
    this.searchTerms.next(term);
  }
}
