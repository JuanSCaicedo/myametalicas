import { AfterViewInit, Component } from '@angular/core';

declare const lucide: {
  createIcons: () => void;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  title = 'front';

  ngAfterViewInit(): void {
    lucide.createIcons();
  }
}
