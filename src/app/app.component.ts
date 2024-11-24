import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './auth.service';
import { Employee } from './employee/employee';
import { EmployeeService } from './employee/employee.service';
import { UserService } from './user.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'employeemanagerapp';
  public employees: Employee[] | null = null;
  public editEmployee: Employee | null | undefined;
  private subscription: Subscription = new Subscription();
  deleteEmployee: any;
  searchKey: any;
  isAdmin: boolean = false;
  userRole: string | null | undefined;
  loginError: string | null = null;
  isModalOpen: boolean = false;
  isButtonClicked = true;
  currentModal: string | null = null;


  constructor(
    private employeeService: EmployeeService,
    public userService: UserService,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (this.authService.checkTokenOnPageLoad()) {
      console.log('User is authenticated');
    } else {
      console.log('User is not authenticated');
    }
    this.userRole = this.userService.getUserRole();
    this.getEmployees();
    
    const btnSwitch = document.getElementById('btnSwitch');
    btnSwitch?.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-bs-theme');
      
      if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-bs-theme', 'light');
        document.body.classList.remove('bg-dark');
        document.body.classList.add('bg-light');
        btnSwitch.textContent = 'Night Mode'; 
      } else {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        document.body.classList.remove('bg-light');
        document.body.classList.add('bg-dark');
        btnSwitch.textContent = 'Day Mode';  
      }
    });
  }

  onLogin(loginForm: NgForm) {
    if (loginForm.valid) {
      const loginData = loginForm.value;
      
      this.userService.login(loginData).subscribe(
        (response) => {
          console.log('Login successful', response);
          if (response && response.accessToken) {
            localStorage.setItem('authToken', response.accessToken);
            this.router.navigate(['/dashboard']);
            this.closeModal();  // Close modal after successful login
          } else {
            console.error('No access token returned.');
          }
        },
        (error) => {
          console.error('Login failed', error);
          if (error.status === 401) {
            this.loginError = 'Invalid credentials. Please try again.'; 
          } else {
            this.loginError = 'An unexpected error occurred. Please try again later.'; 
          }
        }
      );
    } else {
      console.log('Login form is invalid');
    }
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getEmployees(): void {
    this.subscription.add(
      this.employeeService.getEmployees().subscribe({
        next: (response: Employee[]) => {
          this.employees = response;
        },
        error: (error) => {
          console.error('Error fetching employees:', error);
        },
      })
    );
  }
  

  onAddEmployee(addForm: NgForm): void {
    this.employeeService.addEmployee(addForm.value).subscribe(
      (response: Employee) => {
        console.log('Employee added:', response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        console.error('Error adding employee:', error);
      }
    );
  }
  
  public onUpdateEmployee(employee: Employee): void {
    this.employeeService.updateEmployee(employee).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onDeleteEmployee(employeeId: number): void {
    this.employeeService.deleteEmployee(employeeId).subscribe(
      (response: void) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public searchEmployees(key: string): void {
    console.log(key);
    const results: Employee[] = [];
    for (const employee of this.employees ?? []) {
      if (employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.department.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(employee);
      }
    }
    this.employees = results;
    if (results.length === 0 || !key) {
      this.getEmployees();
    }
  }

  public onOpenModal(employee: Employee | null, mode: string): void {
    const container = document.getElementById('main-container');
  
    if (container) {
      const button = document.createElement('button');
      button.type = 'button';
      button.style.display = 'none';
      button.setAttribute('data-toggle', 'modal');
  
      if (mode === 'add') {
        button.setAttribute('data-target', '#addEmployeeModal');
      }
      if (mode === 'edit') {
        this.editEmployee = employee;
        button.setAttribute('data-target', '#updateEmployeeModal');
      }
      if (mode === 'delete') {
        this.deleteEmployee = employee;
        button.setAttribute('data-target', '#deleteEmployeeModal');
      }
  
      container.appendChild(button);
      button.click();
    } else {
      console.error("Container with id 'main-container' not found.");
    }
  }

  openModal(modalType: string) {
    this.isModalOpen = true;
    this.currentModal = modalType;
  }


  closeModal() {
    this.isModalOpen = false;
    this.currentModal = null;
  }
}
