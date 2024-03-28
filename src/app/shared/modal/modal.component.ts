import { Component, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnDestroy{

  @Input()
  modalId: string = '';

  constructor(public modal: ModalService, public elementRef: ElementRef){
  }

  ngOnInit(): void{
    document.body.appendChild(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    document.body.removeChild(this.elementRef.nativeElement);  
  }

  closeModal(){
    this.modal.toggleModal(this.modalId);
  }
}
