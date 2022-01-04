require "application_system_test_case"

class ResumeTest < ApplicationSystemTestCase
  setup do
    @user = users(:resume_screener)
    sign_in @user
  end

  test "resume screener can see resume screening list" do
    sign_in @user
    visit resume_url
    assert_selector "div#screening-tabs", text: "Resume"
    assert_text "Resume Screening"
  end
  test "everyone can see vendor screening list" do
    visit vendor_url
    assert_selector "div#screening-tabs", text: "Vendor"
    assert_text "Vendor Screening"
  end
end