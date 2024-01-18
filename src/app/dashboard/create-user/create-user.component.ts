import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Privileges, Privileges_List } from '@app/_models';
import { AccountService, AlertService } from '@app/_services';
@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  Addform!: FormGroup;
  id?: string;
  title!: string;
  loading = false;
  submitting = false;
  submitted = false;
  privilegeList:any[]
  selectedPrivilegeList : any[] = []
  roles :any[] =[]
  message = ""
  className =''
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
  this.privilegeList = Privileges_List

    this.id = this.route.snapshot.params['id'];
    this.Addform = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required]],
      mobile: ['', Validators.required],
      roles:[[],Validators.required],
      password: ['', [Validators.minLength(8),Validators.required]]
    });

    this.title = 'Add User';
    // if (this.id) {
    //     // edit mode
    //     this.title = 'Edit User';
    //     this.loading = true;
    //     this.accountService.getById(this.id)
    //         .pipe(first())
    //         .subscribe(x => {
    //             this.Addform.patchValue(x);
    //             this.loading = false;
    //         });
    // }
  }

  // convenience getter for easy access to Addform fields
  get f() { return this.Addform.controls; }

  isNumberKey(event: any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 46 || charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }
  onSubmit() {
    console.log(this.Addform.value, 'ddd');
    this.changeRoleFormat()
    console.log(this.roles, 'roles');


    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if Addform is invalid
    if (this.Addform.invalid) {
      return;
    }
    this.Addform.get('roles').patchValue(this.roles)
    this.submitting = true;
    this.accountService.CreateAdminAccount(this.Addform.value)
      .subscribe({
        next: (res: any) => {
          console.log(res, 'res');
          this.message = 'User saved'
          this.className = 'alert alert-sucess'
          this.alertService.success('User saved', { keepAfterRouteChange: true });
          // const returnUrl =  '/';
          // this.router.navigateByUrl(returnUrl);
          this.resetFormAndData()
        },
        error: (error) => {
          console.log(error, 'err');
          this.message = error.error.message || error.message
          this.className = 'alert alert-danger'
          this.alertService.error(error.error.message || error.message);
          this.submitting = false;
          this.resetFormAndData()
        }
      })
  }
  addRole(privilegeID:any){
    this.privilegeList.forEach((privilege:any)=>{
      if(privilege.id==privilegeID){
        privilege.display = false
        console.log('1',this.selectedPrivilegeList.find((role:any)=> role?.id == privilegeID) );

        if(this.selectedPrivilegeList.find((role:any)=> role?.id == privilegeID) == -1 || this.selectedPrivilegeList.find((role:any)=> role?.id == privilegeID) == undefined){
        console.log('23');
        this.selectedPrivilegeList.push(privilege)

        }
      }
    })
  }
  removeRole(privilege:any){
    console.log(privilege , 'ddd');
    const index = this.selectedPrivilegeList.indexOf(privilege);
    console.log('privilege', index);
    if (index > -1) { // only splice array when item is found
      this.selectedPrivilegeList.splice(index, 1); // 2nd parameter means remove one item only
    }

  }
  displayRole(oldPrivilege:any){
    this.privilegeList.forEach((privilege:any)=>{
      if(privilege.id==oldPrivilege?.id && privilege?.display == false){
        privilege.display = true
      }
    })
  }

  changeRoleFormat(){
    console.log(this.selectedPrivilegeList,'dddddddd');

     this.selectedPrivilegeList.forEach((Privilege:any)=>{
      if(this.roles.find((role:any)=>{role.id  == Privilege.id}) == -1 || this.roles.find((role:any)=>{role.id  == Privilege.id}) == undefined){
        console.log('ffffff',Privilege);

        this.roles.push({id:Privilege.id})
      }
     })
     console.log(this.roles, 'roles');

  }
  resetFormAndData(){
    this.Addform.reset()
    this.roles = []
    this.selectedPrivilegeList = []
  }
}
