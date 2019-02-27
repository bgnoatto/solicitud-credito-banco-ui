import { Component, OnInit,OnDestroy} from '@angular/core';
import {Router} from "@angular/router";
import {SelectItem, LazyLoadEvent, ConfirmDialogModule, ConfirmationService, SharedModule} from 'primeng/primeng';
import {Solicitud} from "../../domain/solicitud";
import {SolicitudService} from "../../services/solicitud.service";
import {UserService} from "../../services/user.service";
import {Estado} from "../../domain/estado";
import {UserCarsa} from "../../domain/userCarsa";
//import {DateFormatter} from "@angular/common/src/pipes/intl";
import {AppComponent} from "../../app.component";
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import {Response} from "@angular/http";
import {Message} from "primeng/components/common/api";


import * as moment from 'moment';


@Component({
  selector: 'app-solicitud-list',
  templateUrl: './solicitud-list.component.html',
  styleUrls: ['./solicitud-list.component.css'],
  providers: [ConfirmationService, SharedModule]
})
export class SolicitudListComponent implements OnInit,OnDestroy   {
  public  generos: SelectItem[];
  public  estados: SelectItem[];
  public fechaSelected:Date=null;

  /**
   * FILTROS
   * @type {Date}
   */

  public page:number=0;
  public size:number=10;
  public totalPages:number=0;
  public totalElements:number=0;

  //public msgs: Message[] = [];

  public solicitudes: Solicitud[]=[];
  selected: Solicitud;
  public solicitudPopup: Solicitud;
  public solicitudBorrar: Solicitud;
  public eventBorrar:LazyLoadEvent;

  public display: boolean = false;
  public displayEnvBanco: boolean = false;
  public displayFacturado: boolean = false;
  public displayEnvRiesgo: boolean = false;
  public displayRecRiesgo: boolean = false;
  public displayBorrar: boolean = false;
  public readOnlyState:boolean = false;
  public readOnlyDel:boolean = false;
  es: any;

  public estadoPopup:string;
  public codCredDelete:string;
  public estadoPopupChange:Estado;

  //Campos del filtro
  public codigoOperacionF:string;
  public dniF:string;
  public nombreClienteF:string;
  public codigoLocalF:number;
  public legajoCajeroF:number;
  public estadoF:string;

  valorLegajo:number;

  public msgs: Message[] = [];

  constructor( private router: Router,
               private solicitudService:SolicitudService,
               private userService:UserService,
               private app: AppComponent,
               private slimLoadingBarService: SlimLoadingBarService,
               private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.generos = [];

    this.generos.push({label: 'Masculino', value: 'M'});
    this.generos.push({label: 'Femenino', value: 'F'});
    this.generos.push({label: 'Todo', value: null});

    this.estados = [];
    this.estados.push({label: 'Todo', value: null});
    this.estados.push({label: 'Pendiente', value: Estado.PENDIENTE});
    this.estados.push({label: 'Consumido', value: Estado.CONSUMIDO});
    this.estados.push({label: 'Facturado', value: Estado.FACTURADO});
    this.estados.push({label: 'Enviado a Riesgo', value: Estado.ENVIADO_RIESGO});
    this.estados.push({label: 'Recibido de Riesgo', value: Estado.RECIBIDO_RIESGO});
    this.estados.push({label: 'Enviado al Banco', value: Estado.ENVIADO_BANCO});
    this.estados.push({label: 'Rechazado', value: Estado.RECHAZADO});
    this.estados.push({label: 'Para Rectificar', value: Estado.PARA_RECTIFICAR});
    this.estados.push({label: 'Conciliado', value: Estado.CONCILIADO});
    this.estados.push({label: 'Reenviado', value: Estado.REENVIADO});
    this.estados.push({label: 'Anulado', value: Estado.ANULADO});
    this.estados.push({label: 'Pagado', value: Estado.PAGADO});
    //this.estados.push({label: 'Cancelado', value: Estado.CANCELADO});

    this.es = {
      firstDayOfWeek: 1,
      dayNames: [ "Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado" ],
      dayNamesShort: [ "Dom","Lun","Mar","Mié","Jue","Vie","Sáb" ],
      dayNamesMin: [ "D","L","M","X","J","V","S" ],
      monthNames: [ "Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre" ],
      monthNamesShort: [ "ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC" ]
    };
  }

  ngOnDestroy() {

  }

  loadCreditosPages(filtros:{key:string,value:string}[]){
    let filter:string='';
    filtros.forEach(filtro=>{
      filter=filter+`&${filtro.key}=${filtro.value}`;
    });
    this.startLoading();
    this.solicitudService.getSolicitudrd(`?page=${this.page}&size=${this.size}${filter}`).subscribe(pageCreditos=>{
        this.completeLoading();
        this.solicitudes=pageCreditos.content;
        this.totalPages=pageCreditos.totalPages;
        this.totalElements=pageCreditos.totalElements;
        this.page=pageCreditos.number;
        this.size=pageCreditos.size;

        if(this.totalElements == 0){
          this.app.msgs=[];
          this.app.msgs.push({severity:'info', summary:'Sin Resultados', detail:''});
        }
      },
      error=>{
        this.completeLoading();
        this.solicitudes=null;
        console.log('No se pudo cargar los creditos: ' + error._body);
        let mensaje = this.mensajeDeError(error,'No se pudo cargar los creditos');
        this.app.msgs=[];
        this.app.msgs.push({severity:'error', summary:mensaje, detail:''});
      });
  }

  onSelect(solicitud: Solicitud) {
    this.router.navigate(['/solicitud', solicitud.id]);
  }

  newSolicitud() {
    this.router.navigate(['/solicitud']);
  }

  onclick() {
    console.log('hago un click');
  }

  onChangeState(solicitud: Solicitud, nuevoEstado:Estado) {
    if(solicitud){
      //nuevoEstado = nuevoEstado;
      this.startLoading();
      this.solicitudService.setEstado(solicitud, nuevoEstado).subscribe(solicitud => {
        this.readOnlyState = false;
        this.solicitudes.forEach(s=>{
          if(s.id == solicitud.id){
            s.estado = solicitud.estado;
          }
        });
        this.completeLoading();
        this.app.msgs=[];
        this.app.msgs.push({severity:'info', summary:'Se cambio el estado', detail:'Estado: '
          + this.nombreEstado(solicitud.estado)});
      },
      error=>{
        this.completeLoading();
        this.readOnlyState = false;
        console.log('No cambiar el estado: ' + error._body);
        let mensaje = this.mensajeDeError(error,'No se pudo cambiar el estado');
        this.app.msgs=[];
        this.app.msgs.push({severity:'error', summary:mensaje, detail:''});
      });
    }
  }

  borrar(solicitud:Solicitud, event: LazyLoadEvent){
    this.startLoading();
    this.solicitudService.borrarSolicitud(solicitud).subscribe(solicitud => {
        this.completeLoading();
        this.readOnlyDel = false;
        this.solicitudService.getDisponible(this.app.local).subscribe(disponible => {
            /*if(disponible){
              this.app.disponible = disponible;
            }
            else {
              this.app.disponible = 0.1;
            }*/
            this.app.disponible=disponible;
          },
          error => {
            console.log('No se pudo obtener el credito disponible: ' + error._body);
            let mensaje = this.mensajeDeError(error,'No se pudo obtener el credito disponible');
            this.app.msgs=[];
            this.app.msgs.push({severity:'error', summary:mensaje, detail:''});
          });
        this.msgs=[];
        this.msgs.push({severity:'info', summary:`Credito Borrado`, detail:''});
        this.loadCreditosLazy(event);
      },
      error =>{
        this.completeLoading();
        this.readOnlyDel = false;
        console.log('Error al borrar Solicitud credito: ' + error._body);
        let mensaje = this.mensajeDeError(error,'Error al borrar Solicitud credito');
        this.app.msgs=[];
        this.app.msgs.push({severity:'error', summary:mensaje, detail:''});
      });
    this.closePopups();
  }

  nextState(solicitud:Solicitud): Estado {
    //let resultado:Estado = Estado.CANCELADO;
    if (solicitud) {
      let estado: Estado = solicitud.estado;
      if (estado == Estado.PENDIENTE) {
        return Estado.CONSUMIDO;
      }
      else if (estado == Estado.CONSUMIDO) {
        return Estado.FACTURADO;
      }
      else if (estado == Estado.PARA_RECTIFICAR) {
        return Estado.REENVIADO;
      }
      else if (estado == Estado.CONCILIADO) {
        return Estado.PAGADO;
      }
      else if (estado == Estado.FACTURADO) {
        return Estado.ENVIADO_RIESGO;
      }
    }
  }

  loadCreditosLazy(event: LazyLoadEvent) {
    let filtros:{key:string,value:string}[]=[];
    /*for (let key in event.filters) {
      let value:string;
      if(key == 'estado'){
        value=`${event.filters[key].value}`;
        value = Estado[value]+'';
      }
      /*if(key == 'legajoCajero'){
        value=`${event.filters[key].value}`;
        this.valorLegajo = Number.parseInt(value);
        if(isNaN(this.valorLegajo)){
          this.msgs=[];
          this.msgs.push({severity:'error', summary:"Solo números en el Legajo", detail:''});
        }
      }
      if(key == 'codigoLocal'){
        value=`${event.filters[key].value}`;
        this.valorLegajo = Number.parseInt(value);
        if(isNaN(this.valorLegajo)){
          this.msgs=[];
          this.msgs.push({severity:'error', summary:"Solo números en el Legajo", detail:''});
        }
      }
      filtros.push({key,value});
    }*/
    if(this.codigoOperacionF){
      let value:string=this.codigoOperacionF+'';
      let key:string='codigoOperacion';
      filtros.push({key,value});
    }
    if(this.dniF){
      let value:string=this.dniF;
      let key:string='dniCliente';
      filtros.push({key,value});
    }
    if(this.nombreClienteF){
      let value:string=this.nombreClienteF;
      let key:string='nombreCliente';
      filtros.push({key,value});
    }
    if(this.fechaSelected){
      //let value:string=DateFormatter.format(this.fechaSelected, 'pt', 'dd-MM-yyyy');
      //let value =this.datePipe.transform(this.fechaSelected, 'dd-MM-yyyy');
      let value:string=moment(this.fechaSelected).format('DD-MM-YYYY');
      let key:string='fecha';
      filtros.push({key,value});
    }
    if(this.codigoLocalF){
      let value:string=this.codigoLocalF+'';
      let key:string='codigoLocal';
      filtros.push({key,value});
    }
    if(this.legajoCajeroF){
      let value:string=this.legajoCajeroF+'';
      let key:string='legajoCajero';
      filtros.push({key,value});
    }
    if(this.estadoF){
      let value:string=this.estadoF+'';
      let key:string='estado';
      filtros.push({key,value});
    }
    this.page=event.first/this.size;
    if(isNaN(this.page)){
      this.page = 0;
    }
    setTimeout(() => { this.loadCreditosPages(filtros); }, 0);

  }

  onRowSelect(event) {
    this.onSelect(this.selected);
  }

  popupEstadoMulti(solicitud:Solicitud):boolean{
    let estado:Estado = solicitud.estado;
    if((estado == Estado.ENVIADO_RIESGO)
      || (estado == Estado.RECIBIDO_RIESGO) || (estado == Estado.ENVIADO_BANCO)){
      return true;
    }
    return false;

    //(estado == "FACTURADO") ||
  }

  /*nameEstado(estado:Estado):string{
    let nombre:string = Estado[estado];
    return nombre
  }*/


  tranfersOnChangeState(estado:Estado){
    let stateMod:Estado = estado;
    this.onChangeState(this.solicitudPopup,stateMod);
    this.closePopups();
  }

  habilitarCambioEstado(solicitud:Solicitud):boolean{
    let estado:Estado = solicitud.estado;
    if(this.ultimoEstado(estado)){
      return false;
    }

    let rolesUsr = this.getRolesUsr();

    let validoUsr:boolean = (rolesUsr.indexOf("ROLE_BNA_USER")>-1); //Cajero
    let validoController:boolean = (rolesUsr.indexOf("ROLE_BNA_CONTROLLER")>-1); //Riesgo

    if(validoUsr){
      if((estado == Estado.ENVIADO_RIESGO) || (estado == Estado.RECIBIDO_RIESGO)
        || (estado == Estado.ENVIADO_BANCO) || (estado == Estado.RECHAZADO) || (estado == Estado.PARA_RECTIFICAR)
        || (estado == Estado.REENVIADO) || (estado == Estado.CONCILIADO) || (estado == Estado.PAGADO)){
        return false;
      }
    }
    else if(validoController){
      if((estado == Estado.FACTURADO)){
        return false;
      }
    }
    return true;
  }

  ultimoEstado(estado:Estado):boolean{
    if((estado == Estado.RECHAZADO) || (estado == Estado.CANCELADO)
      || (estado == Estado.PENDIENTE) || (estado == Estado.CONSUMIDO) || (estado == Estado.ANULADO)
      || (estado == Estado.REENVIADO) || (estado == Estado.PAGADO)){
      return true;
    }
    return false;
  }

  habilitarEdicion(solicitud:Solicitud):boolean{
    let estado:Estado = solicitud.estado;

    let rolesUsr = this.getRolesUsr();
    let validoCajero:boolean = (rolesUsr.indexOf("ROLE_BNA_USER")>-1); //cajero

    if((estado == Estado.PENDIENTE) && validoCajero){
      return true;
    }

    return false;
  }

  borrable(solicitud:Solicitud):boolean{
    var estado:Estado = solicitud.estado;

    let rolesUsr = this.getRolesUsr();
    let validoCajero:boolean = (rolesUsr.indexOf("ROLE_BNA_USER")>-1); //cajero

    if((estado == Estado.PENDIENTE) && validoCajero){
      return true;
    }
    return false;
  }

  popupCambiarEstado(solicitud:Solicitud,multi:boolean) {
    this.solicitudPopup = solicitud;
    this.readOnlyState = true;
    if (!multi) {
      this.estadoPopup = this.nextState(solicitud)+"";
      this.estadoPopupChange = this.nextState(solicitud);
      this.display = !this.display;
    }
    else {
      var estadoActual:Estado = solicitud.estado;
      /*if(estadoActual == "FACTURADO"){
        this.displayFacturado = !this.displayFacturado;
      }
      else */
      if(estadoActual == Estado.ENVIADO_RIESGO){
        this.displayEnvRiesgo = !this.displayEnvRiesgo;
      }
      else if(estadoActual == Estado.RECIBIDO_RIESGO){
        this.displayRecRiesgo = !this.displayRecRiesgo;
      }
      else if(estadoActual == Estado.ENVIADO_BANCO){
        this.displayEnvBanco = !this.displayEnvBanco;
      }
    }
  }

  closePopups(){
    this.display = false;
    this.displayEnvBanco = false;
    this.displayFacturado = false;
    this.displayRecRiesgo = false;
    this.displayEnvRiesgo = false;
    this.displayBorrar = false;
    this.readOnlyState = false;
    this.readOnlyDel = false;
  }

  maysPrimera(cadena:string):string{
    return cadena.charAt(0).toUpperCase() + cadena.slice(1).toLowerCase();
  }

  startLoading() {
    this.slimLoadingBarService.start(() => { });
  }

  stopLoading() {
    this.slimLoadingBarService.stop();
  }

  completeLoading() {
   this.slimLoadingBarService.complete();
  }

  mensajeDeError(error:Response, mensajeDefault:string):string{
    if((error.status == 401) || (error.status == 403)){
      mensajeDefault = 'Acceso Denegado';
    }
    if((error.status == 504)){
      mensajeDefault = 'Sin conexión con el servidor';
    }
    return mensajeDefault;
  }

  confirmBorrar(solicitud:Solicitud, event: LazyLoadEvent) {
    this.solicitudBorrar = solicitud;
    this.eventBorrar = event;
    this.codCredDelete = solicitud.codigoOperacion;
    this.readOnlyDel = true;
    this.displayBorrar = !this.displayBorrar;
  }

  getRolesUsr():Array<string>{
    var usr:UserCarsa = this.userService.user;
    let rolesUsrAux:Array<string> = [];
    if(usr != null){
      let rolesUsr = usr.roles;
      rolesUsr.forEach(ru=>{
        rolesUsrAux.push(ru["authority"]);
      });
    }
    return rolesUsrAux;
  }

  filterRole(rolesArray:string):boolean{

      let valido:boolean = false;

      let rolesUsrAux:Array<string> = this.getRolesUsr();
      let rolesVar = rolesArray.split(',');

      rolesUsrAux.forEach(rua=>{
        rolesVar.forEach(rv=>{
          if(rv == rua){
            valido = true;
          }
        })
      })

      return valido;
  }

  limpiarFiltro(event: LazyLoadEvent){
    this.codigoOperacionF = '';
    this.dniF = '';
    this.nombreClienteF = '';
    this.codigoLocalF = null;
    this.legajoCajeroF = null;
    this.estadoF = null;
    this.fechaSelected = null;
    this.loadCreditosLazy(event);
  }

  nombreEstado(estado:Estado):string {
    let resultado: string = 'CANCELADO';
    if (estado) {
      let estadoAux: string = estado.toString().toUpperCase();
      switch (estadoAux) {
        case Estado.PENDIENTE.toString():
          return 'PENDIENTE';
        case Estado.CONSUMIDO.toString():
          return 'CONSUMIDO';
        case Estado.FACTURADO.toString():
          return 'FACTURADO';
        case Estado.CANCELADO.toString():
          return 'CANCELADO';
        case Estado.ENVIADO_RIESGO.toString():
          return 'ENVIADO A RIESGO';
        case Estado.RECIBIDO_RIESGO.toString():
          return 'RECIBIDO DE RIESGO';
        case Estado.ENVIADO_BANCO.toString():
          return 'ENVIADO AL BANCO';
        case Estado.RECHAZADO.toString():
          return 'RECHAZADO';
        case Estado.PARA_RECTIFICAR.toString():
          return 'PARA RECTIFICAR';
        case Estado.CONCILIADO.toString():
          return 'CONCILIADO';
        case Estado.REENVIADO.toString():
          return 'REENVIADO';
        case Estado.ANULADO.toString():
          return 'ANULADO';
        case Estado.INICIAL.toString():
          return 'INICIAL';
        case Estado.PAGADO.toString():
          return 'PAGADO';
        default:
          return 'CANCELADO';
      }
    }
    return resultado;
  }
}
