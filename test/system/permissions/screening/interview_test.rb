require "application_system_test_case"

class InterviewTest < ApplicationSystemTestCase
  setup do
    @user = users(:interviewer)
    sign_in @user
  end

  test "interviewer can see interview screening list" do
    sign_in @user
    visit interview_url
    assert_selector "div#screening-tabs", text: "Interview"
    assert_text "Interview Screening"
  end
  test "everyone can see vendor screening list" do
    visit vendor_url
    assert_selector "div#screening-tabs", text: "Vendor"
    assert_text "Vendor Screening"
  end
end
