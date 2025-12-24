using backend.DTOs.Member;
using backend.Services.Member;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class MemberController : ControllerBase
{
    private readonly IMemberService _memberService;

    public MemberController(IMemberService memberService)
    {
        _memberService = memberService;
    }

    // GET: api/Member
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetMembers()
    {
        var members = await _memberService.GetAllMembersAsync();
        return Ok(members);
    }

    // GET: api/Member/5
    [HttpGet("{id}")]
    public async Task<ActionResult<MemberDto>> GetMember(int id)
    {
        var memberDto = await _memberService.GetMemberByIdAsync(id);

        if (memberDto == null)
        {
            return NotFound();
        }

        return Ok(memberDto);
    }

    // PUT: api/Member/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutMember(int id, UpdateMemberDto updateMemberDto)
    {
        var wasUpdated = await _memberService.UpdateMemberAsync(id, updateMemberDto);
        if (!wasUpdated)
        {
            return NotFound();
        }

        return NoContent();
    }

    // DELETE: api/Member/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMember(int id)
    {
        var wasDeleted = await _memberService.DeleteMemberAsync(id);
        if (!wasDeleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}