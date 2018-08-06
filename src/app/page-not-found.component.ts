
import { OnInit, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	'template': '<h1>Hola page not found</h1>',
})
export class PageNotFoundComponent implements OnInit {
	constructor(private route: ActivatedRoute, private router: Router) {
	    this.route.params.subscribe(res => console.log(res.id));
	  }

	  ngOnInit() {
	  }

		Home() {
			this.router.navigate(['']);
		}

}
