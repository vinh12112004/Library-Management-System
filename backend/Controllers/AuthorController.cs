using backend.DTOs.Author;
using backend.Services.Author;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthorController : ControllerBase
    {
        private readonly IAuthorService _authorService;

        public AuthorController(IAuthorService authorService)
        {
            _authorService = authorService;
        }

        // GET: api/Author
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AuthorDto>>> GetAuthors([FromQuery] AuthorQuery query)
        {
            if (query.PageNumber < 1 || query.PageSize < 1)
                return BadRequest("PageNumber và PageSize phải > 0");

            query.PageSize = Math.Min(query.PageSize, 50);

            var result = await _authorService.GetAllAuthorsAsync(query);
            return Ok(result);
        }

        // GET: api/Author/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AuthorDto>> GetAuthor(int id)
        {
            var authorDto = await _authorService.GetAuthorByIdAsync(id);

            if (authorDto == null)
            {
                return NotFound();
            }

            return Ok(authorDto);
        }

        // POST: api/Author
        [HttpPost]
        public async Task<ActionResult<AuthorDto>> PostAuthor(CreateAuthorDto createAuthorDto)
        {
            var newAuthorDto = await _authorService.CreateAuthorAsync(createAuthorDto);
            return CreatedAtAction(nameof(GetAuthor), new { id = newAuthorDto.AuthorId }, newAuthorDto);
        }

        // PUT: api/Author/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAuthor(int id, UpdateAuthorDto updateAuthorDto)
        {
            var wasUpdated = await _authorService.UpdateAuthorAsync(id, updateAuthorDto);
            if (!wasUpdated)
            {
                return NotFound();
            }

            return NoContent();
        }

        // DELETE: api/Author/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAuthor(int id)
        {
            var wasDeleted = await _authorService.DeleteAuthorAsync(id);
            if (!wasDeleted)
            {
                return NotFound();
            }

            return NoContent();
        }
        // 
        [HttpGet("{id}/books")]
        public async Task<IActionResult> GetBooksByAuthor(int id)
        {
            var books = await _authorService.GetBooksByAuthorIdAsync(id);
            return Ok(books);
        }
    }
}