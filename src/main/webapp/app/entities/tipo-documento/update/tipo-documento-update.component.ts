import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ITipoDocumento, TipoDocumento } from '../tipo-documento.model';
import { TipoDocumentoService } from '../service/tipo-documento.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { State } from 'app/entities/enumerations/state.model';

@Component({
  selector: 'ss-35-tipo-documento-update',
  templateUrl: './tipo-documento-update.component.html',
})
export class TipoDocumentoUpdateComponent implements OnInit {
  isSaving = false;
  stateValues = Object.keys(State);

  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    iniciales: [null, [Validators.required, Validators.maxLength(12)]],
    nombreDocumento: [null, [Validators.required, Validators.maxLength(50)]],
    estadoTipoDocumento: [null, [Validators.required]],
    user: [],
  });

  constructor(
    protected tipoDocumentoService: TipoDocumentoService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tipoDocumento }) => {
      this.updateForm(tipoDocumento);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const tipoDocumento = this.createFromForm();
    if (tipoDocumento.id !== undefined) {
      this.subscribeToSaveResponse(this.tipoDocumentoService.update(tipoDocumento));
    } else {
      this.subscribeToSaveResponse(this.tipoDocumentoService.create(tipoDocumento));
    }
  }

  trackUserById(_index: number, item: IUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITipoDocumento>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(tipoDocumento: ITipoDocumento): void {
    this.editForm.patchValue({
      id: tipoDocumento.id,
      iniciales: tipoDocumento.iniciales,
      nombreDocumento: tipoDocumento.nombreDocumento,
      estadoTipoDocumento: tipoDocumento.estadoTipoDocumento,
      user: tipoDocumento.user,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, tipoDocumento.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): ITipoDocumento {
    return {
      ...new TipoDocumento(),
      id: this.editForm.get(['id'])!.value,
      iniciales: this.editForm.get(['iniciales'])!.value,
      nombreDocumento: this.editForm.get(['nombreDocumento'])!.value,
      estadoTipoDocumento: this.editForm.get(['estadoTipoDocumento'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
