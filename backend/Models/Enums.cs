namespace backend.Models
{
    public enum AuthorRole
    {
        Main, CoAuthor, Translator
    }

    public enum CopyStatus
    {
        Available, Borrowed, Maintenance, Lost, Damaged
    }

    public enum MembershipType
    {
        Student, Teacher, Community
    }

    public enum MemberStatus
    {
        Active, Suspended, Expired
    }
    
    public enum RoleType
    {
        Admin = 0,
        Librarian = 1,
        Assistant = 2,
        Reader = 3
    }

    public enum LoanStatus
    {
        Borrowing, Returned, Overdue, Lost
    }

    public enum ReservationStatus
    {
        Pending, Ready, PickedUp, Cancelled, Expired
    }

    public enum FineType
    {
        LateReturn, LostBook, DamagedBook
    }

    public enum FineStatus
    {
        Unpaid, Paid, Waived
    }

    public enum ActivityUserType
    {
        Staff, Member
    }
}
