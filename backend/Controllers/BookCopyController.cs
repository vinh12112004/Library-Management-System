using backend.DTOs.BookCopy;
using backend.Services.BookCopy;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookCopyController : ControllerBase
    {
        private readonly IBookCopyService _bookCopyService;

        public BookCopyController(IBookCopyService bookCopyService)
        {
            _bookCopyService = bookCopyService;
        }

        // GET: api/BookCopy
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<BookCopyDto>>> GetBookCopies()
        {
            var bookCopies = await _bookCopyService.GetAllBookCopiesAsync();
            return Ok(bookCopies);
        }

        // GET: api/BookCopy/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<BookCopyDto>> GetBookCopy(int id)
        {
            var bookCopyDto = await _bookCopyService.GetBookCopyByIdAsync(id);
            if (bookCopyDto == null)
            {
                return NotFound();
            }
            return Ok(bookCopyDto);
        }

        // POST: api/BookCopy
        [HttpPost]
        [Authorize(Roles =  "Admin,Librarian,Assistant")]
        public async Task<ActionResult<BookCopyDto>> PostBookCopy([FromBody] CreateBookCopyDto createBookCopyDto)
        {
            var newBookCopyDto = await _bookCopyService.CreateBookCopyAsync(createBookCopyDto);
            return CreatedAtAction(nameof(GetBookCopy), new { id = newBookCopyDto.CopyId }, newBookCopyDto);
        }

        // PUT: api/BookCopy/5
        [HttpPut("{id}")]
        [Authorize(Roles =  "Admin,Librarian,Assistant")]
        public async Task<IActionResult> PutBookCopy(int id, [FromBody] UpdateBookCopyDto updateBookCopyDto)
        {
            var wasUpdated = await _bookCopyService.UpdateBookCopyAsync(id, updateBookCopyDto);
            if (!wasUpdated)
            {
                return NotFound();
            }
            return NoContent();
        }

        // DELETE: api/BookCopy/5
        [HttpDelete("{id}")]
        [Authorize(Roles =  "Admin,Librarian,Assistant")]
        public async Task<IActionResult> DeleteBookCopy(int id)
        {
            var wasDeleted = await _bookCopyService.DeleteBookCopyAsync(id);
            if (!wasDeleted)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}