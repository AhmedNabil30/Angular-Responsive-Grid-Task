import { 
    trigger, 
    style, 
    animate, 
    transition, 
    query, 
    stagger 
  } from '@angular/animations';
  
  export const gridAnimations = {
    listAnimation: trigger('listAnimation', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('50ms', [
            animate('300ms ease-out', 
              style({ opacity: 1, transform: 'translateY(0)' })
            )
          ])
        ], { optional: true }),
        query(':leave', [
          stagger('50ms', [
            animate('300ms ease-out', 
              style({ opacity: 0, transform: 'translateY(20px)' })
            )
          ])
        ], { optional: true })
      ])
    ]),
    
    fadeAnimation: trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ])
  };