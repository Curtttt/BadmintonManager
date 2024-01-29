import { Injectable, inject } from '@angular/core';
import { Firestore, collectionData, updateDoc, collection, deleteDoc, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class crudService {
  firestore: Firestore = inject(Firestore)

  getCollection(collection_: any) {
    let query = collection(this.firestore, collection_)
    return collectionData(query, { idField: 'id' }) as Observable<any>;
  }

  updateDocument(collection: string, id: string, data: any) {
    let Doc = doc(this.firestore, collection, id);
    updateDoc(Doc, data);
  }

  deleteDocument(collection: string, id: string, data: any) {
    let Doc = doc(this.firestore, collection, id);
    deleteDoc(Doc);
  }

}
