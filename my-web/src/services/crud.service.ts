import { Injectable, inject } from '@angular/core';
import { Firestore, collection, deleteDoc, doc, getDocs, getFirestore, query, where, WhereFilterOp, updateDoc, onSnapshot, setDoc, addDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class crudService {
  firestore: Firestore = inject(Firestore);
  db = getFirestore(); unsub: any;

  private editSource = new BehaviorSubject<any>(null);
  editListener = this.editSource.asObservable(); 

  private infoSource = new BehaviorSubject<any>(null);
  currentInfo = this.infoSource.asObservable();

  editInfo(info: any) { this.infoSource.next(info); }

  async createDocument(collection_: string, data: any, id_?: any){
    if (id_ == undefined)
      await addDoc(collection(this.db, collection_), data);
    else await setDoc(doc(this.db, collection_, id_), data);
  }

  async getCollection(collection_: any) {
    let lst: any = [];
    const querySnapshot = await getDocs(collection(this.db, collection_));
    querySnapshot.forEach((doc) => {
      let data = { id: doc.id, ...doc.data() };
      lst.push(data);
    });
    return lst;
  }

  async findInDocument(_collection: string, field: string, equation: WhereFilterOp, value: any) {
    let ref = collection(this.db, _collection);
    let query_ = query(ref, where(field, equation, value));
    let lst: any = [];
    let querySnapshot = await getDocs(query_);
    querySnapshot.forEach((doc) => {
      let data = { id: doc.id, ...doc.data() };
      lst.push(data);
    });
    return lst;
  }

  updateDocument(collection_: string, id: string, data: any) {
    let Doc = doc(this.firestore, collection_, id);
    updateDoc(Doc, data);

    let unsub = onSnapshot(Doc, (doc) => {
      this.editSource.next( { id: doc.id, ...doc.data() } );
    });
    return () => unsub();
  }

  deleteDocument(collection_: string, id: string, data: any) {
    let Doc = doc(this.firestore, collection_, id);
    deleteDoc(Doc);
  }

}
