export interface IYouthMember {
  Firstname: string;
  Lastname: string;
  Othername: string | null;
  Email: string;
  Phonenumber: string;
  DoB: string | Date;
  Gender: string;
  Residence: string;
  BibleStudyCareCell: string | null;
  EmergencyContactName: string | null;
  EmergencyContactRelationship: string | null;
  EmergencyContact: string | null;
}
