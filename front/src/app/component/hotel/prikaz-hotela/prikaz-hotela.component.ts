import { Component, OnInit } from '@angular/core';
import { Hotel } from 'app/model/hotel/hotel';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { AuthService } from 'app/auth.service';
import { HotelService } from 'app/service/hotel/hotel.service';

@Component({
  selector: 'app-prikaz-hotela',
  templateUrl: './prikaz-hotela.component.html',
  styleUrls: ['./prikaz-hotela.component.css']
})
export class PrikazHotelaComponent implements OnInit {

  public hoteli: Hotel[] = [];
  public tipkorisnika: string;
  adreseRenta: string[] = [];
  pomAdreseRenta: string[] = [];
  naziviRenta: string[] = [];
  dropdownSettings = {};
  izabranaAdresa: string = "";
  izabraniNaziv: string = "";
  paramDir: string = "ASC";
  ocenjiviRentovi: number[];
  prihod: number;
  idRezervacije: number = 0;
  idFilijala: number = 0;

  constructor(private route: ActivatedRoute, private hotelService : HotelService, private router: Router, private authService: AuthService
   ) 
   {
    let res = localStorage.getItem('token');
    if(res != null){
      //this.tipkorisnika = this.authService.getRoles(res);
    }
    else{
      this.tipkorisnika = "nema_korisnika";
    }
    this.getAll();
  }

  ngOnInit() {

    this.hotelService.vratiSveAdrese().subscribe(
      s => 
      {
       s.forEach(item => {
          let temp: string = item.zemlja + " " + item.grad + " " + item.ulica + " " + item.broj;
          this.pomAdreseRenta.push(temp);
        }); 

        this.adreseRenta = this.pomAdreseRenta;
      }
    )

    this.hotelService.vratiSveNazive().subscribe(
      a => 
      {
        this.naziviRenta = a;
      }
    )


    this.dropdownSettings = {
      singleSelection: true,
      // idField: 'id',
      //textField: 'adreseRenta',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

   /* this.route.queryParams.subscribe(params => {
      if(params["idRezervacije"] !== undefined){
        this.idRezervacije = params["idRezervacije"];
      }
    });*/
  }

  getAll(){
    /*if(this.tipkorisnika !== "nema_korisnika"){
      this.rentacarService.vratiListuOcenjivihServisa().subscribe(
        a => 
        {
          this.ocenjiviRentovi = a;
          this.rentacarService.findAll().subscribe(
        
            s => { 
              this.rentacarovi = s;  
            }
          );
        }
      );
    }*/
    //else{
      this.hotelService.findAll().subscribe(
        
        s => { 
          this.hoteli = s;
        }
      );
   // }
  }

  delete(id: number){
    this.hotelService.delete(id).subscribe(
      s => this.getAll(),
      err=> console.log("err")
    );    
   }
 
   update(id: number){
    this.router.navigate(['hoteli/add', id]);
   }

   postaviFilijalu(id: number){
    this.idFilijala = id;
   }

   viewDetails(id: number){
     //if(this.idFilijala != 0){
      this.router.navigate(['hoteli/' + id + '/sobe']);
     /*}
     else{
       alert('izaberi filjalu');
     }*/
    
  }

  createRoom(id: number){
    this.router.navigate(['hoteli/' + id + '/sobe/add']);
  }

  createOption(id: number){
    this.router.navigate(['hoteli/' + id + '/opcije/add']);
  }

  viewOption(id: number){
    this.router.navigate(['hoteli/' + id + '/opcije']);
  }

  imageClick(id: number){
    /*if(this.idRezervacije !== 0){
      let navigationExtras: NavigationExtras = {
        queryParams: {
            "idRezervacije" : this.idRezervacije
        }
      };
      this.router.navigate(['rentacarovi/' +  id + '/prikazVozila'], navigationExtras);
    }
    else {
      this.router.navigate(['rentacarovi/' +  id + '/prikazVozila']);
    }*/
  }

  spanClick(id: number){
    //this.router.navigate(['rentacarovi/' +  id + '/prikazFilijala']);
  }

  ulogovaniKorisnikImaDozvoluDaMenja(){
    /*if( this.tipkorisnika === "ROLE_Administrator_rent_a_car_servisa" || this.tipkorisnika === "ROLE_Administrator_sistema"){
      return true;
    }
    return false; */
    return true;
  }

  ulogovaniKorisnikImaDozvoluDaBrise(){
    // if(this.tipkorisnika === "ROLE_Administrator_sistema"){
    //   return true;
    // }
    // return false; 
    return true;
  }

  rezervisiDugme(){
    if(this.tipkorisnika === "ROLE_Registrovani_korisnik"){
      return true;
    }
    return false; 
  }

  ocenaVidljivo(){
    if(this.tipkorisnika === "ROLE_Registrovani_korisnik"){
      return true;
    }
    return false; 
  }

  trazi(){
    // this.rentacarService.trazenjeRentacarova(this.izabraniNaziv, this.izabranaAdresa).subscribe(
    //   s => {
    //     this.rentacarovi = s;
    //   },
    //   err=> console.log("err")
    // );    
  }

  getAllSort(paramSort: string){
    this.hotelService.findAllSort(paramSort, this.paramDir).subscribe(
      ss => { this.hoteli = ss; }
    );
    if (this.paramDir === 'ASC'){
      this.paramDir = 'DESC';
    } else {
      this.paramDir = 'ASC';
    }
  }

  brzaRezervacija(){
    let navigationExtras: NavigationExtras = {
      queryParams: {
          "idRezervacije" : this.idRezervacije
      }
    };
    this.router.navigate(['rentacarovi/brzaRezervacijaVozila'], navigationExtras);
  }

  daLiSmeDaOceni(id: number): boolean{
    if(this.ocenjiviRentovi.indexOf(id) > -1 ) {
      return false;
    }
    else{
      return true;
    }
  }

  oceniServis(rentacar: Hotel){
    /*if(rentacar.ulogovanogKorisnikaOcena > 0){
      let ocena: OcenaRenta = new OcenaRenta();
      ocena.rentACar = rentacar;
      ocena.ocenaRenta = rentacar.ulogovanogKorisnikaOcena;
      this.rentacarService.oceniServis(1, ocena).subscribe(
        ajde => 
        {
        }
      )
    }*/
  }

  pokaziMapu(longitude : number, latitude: number){
    //this.router.navigate(['prikaziMapu/' + longitude + "/" + latitude]);
  }

  vidjivoBrzeRezervacije(){
    if(this.tipkorisnika === "ROLE_Registrovani_korisnik" && this.idRezervacije !== 0){
      return true;
    }
    return false; 
  }
}