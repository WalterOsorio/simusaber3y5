import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DocenteService } from '../service/docente.service';
import { IDocente, Docente } from '../docente.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IDocenteMateria } from 'app/entities/docente-materia/docente-materia.model';
import { DocenteMateriaService } from 'app/entities/docente-materia/service/docente-materia.service';

import { DocenteUpdateComponent } from './docente-update.component';

describe('Docente Management Update Component', () => {
  let comp: DocenteUpdateComponent;
  let fixture: ComponentFixture<DocenteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let docenteService: DocenteService;
  let userService: UserService;
  let docenteMateriaService: DocenteMateriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DocenteUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(DocenteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DocenteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    docenteService = TestBed.inject(DocenteService);
    userService = TestBed.inject(UserService);
    docenteMateriaService = TestBed.inject(DocenteMateriaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const docente: IDocente = { id: 456 };
      const user: IUser = { id: 65039 };
      docente.user = user;

      const userCollection: IUser[] = [{ id: 95259 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ docente });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call DocenteMateria query and add missing value', () => {
      const docente: IDocente = { id: 456 };
      const docenteMateria: IDocenteMateria = { id: 78829 };
      docente.docenteMateria = docenteMateria;

      const docenteMateriaCollection: IDocenteMateria[] = [{ id: 24897 }];
      jest.spyOn(docenteMateriaService, 'query').mockReturnValue(of(new HttpResponse({ body: docenteMateriaCollection })));
      const additionalDocenteMaterias = [docenteMateria];
      const expectedCollection: IDocenteMateria[] = [...additionalDocenteMaterias, ...docenteMateriaCollection];
      jest.spyOn(docenteMateriaService, 'addDocenteMateriaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ docente });
      comp.ngOnInit();

      expect(docenteMateriaService.query).toHaveBeenCalled();
      expect(docenteMateriaService.addDocenteMateriaToCollectionIfMissing).toHaveBeenCalledWith(
        docenteMateriaCollection,
        ...additionalDocenteMaterias
      );
      expect(comp.docenteMateriasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const docente: IDocente = { id: 456 };
      const user: IUser = { id: 5052 };
      docente.user = user;
      const docenteMateria: IDocenteMateria = { id: 91485 };
      docente.docenteMateria = docenteMateria;

      activatedRoute.data = of({ docente });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(docente));
      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.docenteMateriasSharedCollection).toContain(docenteMateria);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Docente>>();
      const docente = { id: 123 };
      jest.spyOn(docenteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ docente });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: docente }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(docenteService.update).toHaveBeenCalledWith(docente);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Docente>>();
      const docente = new Docente();
      jest.spyOn(docenteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ docente });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: docente }));
      saveSubject.complete();

      // THEN
      expect(docenteService.create).toHaveBeenCalledWith(docente);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Docente>>();
      const docente = { id: 123 };
      jest.spyOn(docenteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ docente });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(docenteService.update).toHaveBeenCalledWith(docente);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackUserById', () => {
      it('Should return tracked User primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackDocenteMateriaById', () => {
      it('Should return tracked DocenteMateria primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackDocenteMateriaById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
