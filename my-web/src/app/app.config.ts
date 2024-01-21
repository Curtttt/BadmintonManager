import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { app } from '../environments/environment'

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimations(), importProvidersFrom([
    provideFirebaseApp(() => app),
    provideFirestore(() => getFirestore()),
  ])]
};
