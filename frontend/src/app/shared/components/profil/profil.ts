import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { ProfilFormData, profilSchema } from '../../validators/auth.validators';
import { AuthService } from '../../../core/services/auth';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../../core/services/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profil',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class Profil implements OnInit {
authService = inject(AuthService)
route = inject(ActivatedRoute)
userService = inject(UserService)


  profil = signal<User | null>(null);
  loading = signal(true)
  editMode = signal(false)
  saving = signal(false)
  errors = signal<Partial<Record<keyof ProfilFormData, string>>>({})
  skillInput = signal('')

  // Check if current user is the owner of the profile
  IsOwner = computed(() => {
    const current = this.authService.currentUser()
    const profil = this.profil()
    return current && profil && current.id === profil.id
  } )


  form : ProfilFormData = {
    fullName: '',
    bio: '',
    github: '',
    website: '',
    skills: [],
  }


  // Initialize component
ngOnInit() {
  

  const username = this.route.snapshot.paramMap.get('username')
  if(!username){
    return
  }

  this.userService.getProfile(username).subscribe({
    next : (user) => {
      this.profil.set(user)
      this.form = {
        // ?? allows null or undefined values to be assigned
        fullName: user.fullName ?? '',
        bio: user.bio ?? '',
        github: user.github ?? '',
        website: user.website ?? '',
        skills:  [...(user.skills ?? [])],
      };
      this.loading.set(false)
    },
    error : () => {
      this.loading.set(false)
    }
  })
  
}

// Toggle edit mode
toggleEdit() {
  this.editMode.update(value => !value)
  this.errors.set({})
}


addSkill() {
  const skill = this.skillInput().trim()
  if(!skill || this.form.skills!.includes(skill)){
    return
  }
  
  this.form.skills = [...(this.form.skills ?? []), skill]
  this.skillInput.set('')
}


// Remove skill
removeSkill(skill:string) {
  this.form.skills = this.form.skills?.filter((s) => s!== skill)
}



// Handle skill input keydown
onSkillKeydown(event: KeyboardEvent) {
  if(event.key === 'Enter') {
    event.preventDefault()
    this.addSkill()
  }
}

saveProfile() {
const result = profilSchema.safeParse(this.form)

if(!result.success) {
  const fieldErrors : Partial<Record<keyof ProfilFormData, string>> = {}
  result.error.issues.forEach(issue => {
    const field = issue.path[0] as keyof ProfilFormData
    fieldErrors[field] = issue.message
  })
  this.errors.set(fieldErrors)
  return
}

this.saving.set(true)

this.userService.updateProfile(this.form).subscribe({
  next : (updatedUser) => {
    this.profil.set(updatedUser)
    this.authService.currentUser.set(updatedUser)
    this.saving.set(false)
    this.editMode.set(false)
  },
  error : () => {
    this.saving.set(false)
  }
})
}
}


