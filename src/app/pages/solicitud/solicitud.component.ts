import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location }                 from '@angular/common';
import {Solicitud} from "../../domain/solicitud";
import {SolicitudService} from "../../services/solicitud.service";
import {Estado} from "../../domain/estado";
import {SelectItem} from "primeng/primeng";
import {Message} from "@angular/compiler/src/i18n/i18n_ast";
import {FormGroup, FormBuilder, Validators, FormControl} from "@angular/forms";
import {ClienteService} from "../../services/cliente.service";
import {Cliente} from "../../domain/cliente";
import {AppComponent} from "../../app.component";
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.css']
})
export class SolicitudComponent implements OnInit {

  generos: SelectItem[];

  public solicitud:Solicitud;
  public save:boolean=false;
  public clienteCargado:Cliente;
  public editar:string;

  public flagMonto:boolean=false;
  public flagMontoLimite:boolean=false;
  public flagExisteCodigo:boolean=false;
  public bloqSave:boolean = false; //Bloquea momentaneamente el boton guardar.

  public editCodOpe:boolean = true;

  public flagCargaCliente:boolean = false;

  solicitudForm: FormGroup;

  submitted: boolean;

  active: boolean=true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private solicitudService: SolicitudService,
    private clienteService: ClienteService,
    private fb: FormBuilder,
    private app: AppComponent,
    private slimLoadingBarService: SlimLoadingBarService
  ) {}

  onSubmit() {
    if (this.habilitarGuardar()) {
      this.submitted = true;
      //this.solicitud = this.solicitudForm.value;
      this.saveSolicitud(this.solicitud);
    }else{
      this.app.msgs=[];
      this.app.msgs.push({severity:'error', summary:`Verifique los campos ingresados`, detail:''});
    }
  }

  buildForm(): void {
    this.solicitudForm = this.fb.group({
      'dniCliente': [this.solicitud.dniCliente, [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(10)
      ]],
      'codigoOperacion': [this.solicitud.codigoOperacion, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30)
      ]],
      'sexoCliente':  [this.solicitud.sexoCliente, [
        Validators.required
        ]],
      'monto':  [this.solicitud.monto, [
        Validators.required
      ]],
      'observaciones':  [this.solicitud.observaciones, Validators.maxLength(1020)],

    });
    this.solicitudForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // (re)set validation messages now
  }

  addSolicitud() {
    this.solicitud = this.solicitud={
      id:null,
      codigoOperacion:'',
      dniCliente:'',
      sexoCliente:'M',
      nombreCliente:'',
      monto:0,
      fecha:new Date(),
      codigoLocal:'',
      legajoCajero:null,
      observaciones:'',
      estado:Estado.PENDIENTE,
      estadoAnt:Estado.INICIAL,
      cuotas:36
    };
    this.buildForm();
    this.active = false;
    setTimeout(() => this.active = true, 0);
  }

  mayorDisponible() {
    if(this.solicitud.monto>this.app.disponible){
      this.flagMonto=true;
      this.flagMontoLimite = false;
      this.formErrors['monto']='';
    }
    else{
      this.flagMonto = false;
      this.flagMontoLimite = false;
      this.formErrors['monto']='';
    }

    let montoI:number = this.solicitud.monto;
    if(montoI < 5000 || montoI > 80000){
      this.flagMontoLimite = true;
      this.flagMonto=false;
      this.formErrors['monto']='';
    }
    else {
      this.flagMontoLimite = false;
      this.flagMonto=false;
      this.formErrors['monto']='';
    }
  }

  onValueChanged(data?: any) {
    if (!this.solicitudForm) { return; }
    const form = this.solicitudForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }
  formErrors = {
    'codigoOperacion':'',
    'dniCliente': '',
    'sexoCliente': '',
    'monto':'',
    'observaciones':''
  };
  validationMessages = {
    'dniCliente': {
      'required':      'Campo Requerido.',
      'minlength':     'Minimo 8 números.',
      'maxlength':     'Maximo 10 números.'
    },
    'codigoOperacion': {
      'required':      'Campo Requerido.',
      'minlength':     'Minimo 4 números.',
      'maxlength':     'Maximo 30 números.'
    },
    'sexoCliente': {
      'required': 'Campo Requerido.'
    },
    'monto': {
      'required': 'Campo Requerido.'
    },
    'observaciones': {
      'maxlength':     'Maximo 1020 caracteres.'
    }
  };

  ngOnInit() {
    this.generos = [];
    this.generos.push({label:'Masculino', value:'M'});
    this.generos.push({label:'Femenino', value:'F'});

    let idSolicitud:string = this.route.snapshot.params['id'];
    if(idSolicitud){
      this.solicitudService.getSolicitud(idSolicitud).subscribe(solicitud => {
        this.solicitud=solicitud;
        this.save=false;
        this.buildForm();
        this.active = false;
        this.flagCargaCliente = true;
        this.editCodOpe = false;
        this.editar = "Editando ";
        setTimeout(() => this.active = true, 0);
      });
    }else {
      this.save=true;
      this.editCodOpe = true;
      this.addSolicitud();
    }
  }

  saveSolicitud(solicitud:Solicitud){
    this.bloqSave = true;
    this.solicitudService.saveSolicitud(solicitud).subscribe(solicitud => {
      this.bloqSave = false;
      this.solicitud=null;
      this.app.msgs=[];
      this.app.msgs.push({severity:'info', summary:`Credito Guardado`, detail:''});
      this.gotoSolicitudStatus();
        this.solicitudService.getDisponible(this.app.local).subscribe(disponible => {
          /*if(disponible){
            this.app.disponible = disponible;
          }
          else {
            this.app.disponible = 0.1;
          }*/
          this.app.disponible=disponible;
        }, error => {
          this.app.msgs=[];
          this.app.msgs.push({severity:'error', summary:`Error al actualizar disponible local`, detail:''});
        });
    },
    error =>{
      this.bloqSave = false;
      this.app.msgs=[];
      this.app.msgs.push({severity:'error', summary:`Error al guardar Solicitud credito`, detail:''});
    });
  }

  existeCodigoOperacion(codigoOperacion:string):boolean{
    //if(codigoOperacion && !this.editCodOpe){
    if(codigoOperacion){
      this.solicitudService.existeCodigoOperacion(codigoOperacion.toUpperCase()).subscribe(existe => {
        if(existe > 0){
          this.flagExisteCodigo = true;
        }
        else
          this.flagExisteCodigo = false;
      }, error => {
        this.app.msgs=[];
        this.app.msgs.push({severity:'error', summary:`Error al actualizar disponible local`, detail:''});
      });
    }
    return this.flagExisteCodigo;
  }

  gotoSolicitudStatus() {
    this.location.back();
  }

  cargarCliente() {
    let ctrolDocumento=this.solicitudForm.get('dniCliente');
    let ctrolSexo=this.solicitudForm.get('sexoCliente');
    this.app.msgs=[];
    if( ctrolDocumento.valid && ctrolSexo.valid){
      this.clienteService.getCliente(ctrolDocumento.value,ctrolSexo.value).subscribe(cliente=>{
          this.clienteCargado=cliente;
          this.solicitud.nombreCliente=`${cliente.apellido}, ${cliente.nombre}`;
          this.solicitud.dniCliente=ctrolDocumento.value;
          this.solicitud.sexoCliente=ctrolSexo.value;
          this.flagCargaCliente = true;
          this.completeLoading();
        },
        error=>{
          this.clienteCargado=null;
          this.solicitud.nombreCliente='';
          this.flagCargaCliente = false;
          this.app.msgs=[];
          this.app.msgs.push({severity:'error', summary:'Cliente NO Existe', detail:`DNI: ${ctrolDocumento.value} y Sexo: ${ctrolSexo.value}`});
          this.completeLoading();
        });
    }else {
      console.log('No posee documento o sexo cargado');
    }
  }

  habilitarGuardar(){
    return (this.solicitudForm.valid && !this.flagMonto
    && !this.flagExisteCodigo && this.flagCargaCliente
    && !this.flagMontoLimite);
  }

  startLoading() {
    this.slimLoadingBarService.start(() => { });
  }

  completeLoading() {
    this.slimLoadingBarService.complete();
  }
}
