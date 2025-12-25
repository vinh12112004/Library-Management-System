using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Models;

namespace backend.DTOs.BookCopy
{
    public class BookCopyDto
    {
        public int CopyId { get; set; }
        public int BookId { get; set; }
        public string Barcode { get; set; }
        public string BookTitle { get; set; }
        public CopyStatus Status { get; set; }
        public string Location { get; set; }
        public DateTime? AcquisitionDate { get; set; }
        public decimal? Price { get; set; }
        public string ConditionNote { get; set; }
    }

    public class CreateBookCopyDto
    {
        [Required]
        public int BookId { get; set; }

        [Required]
        [MaxLength(50)]
        public string Barcode { get; set; }

        public CopyStatus Status { get; set; } = CopyStatus.Available;

        [MaxLength(100)]
        public string Location { get; set; }

        public DateTime? AcquisitionDate { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? Price { get; set; }

        public string ConditionNote { get; set; }
    }

    public class UpdateBookCopyDto
    {
        [Required]
        public int BookId { get; set; }

        [MaxLength(50)]
        public string Barcode { get; set; }

        public CopyStatus Status { get; set; }

        [MaxLength(100)]
        public string Location { get; set; }

        public DateTime? AcquisitionDate { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? Price { get; set; }

        public string ConditionNote { get; set; }
    }
}