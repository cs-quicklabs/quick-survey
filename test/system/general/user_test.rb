require "application_system_test_case"

class UserTest < ApplicationSystemTestCase
  setup do
    @user = users(:regular)
    sign_in @user
  end

  def page_url
    profile_url
  end

  test "can visit profile page if logged in" do
    visit page_url
    take_screenshot
    assert_selector "h1", text: "Profile Settings"
  end

  test "can not visit profile page if not logged in" do
    sign_out @user
    visit page_url
    assert_selector "h1", text: "Sign in to your account"
  end

  test "can edit user profile" do
    visit page_url
    click_on "Save"
    take_screenshot
    assert_text "User was updated successfully"
  end

  test "can not edit user profile with empty name email" do
    visit page_url
    fill_in "First Name", with: ""
    fill_in "Last Name", with: ""
    fill_in "Email", with: ""
    click_on "Save"
    take_screenshot
    assert_text "Email can't be blank"
  end

  test "can not edit user with duplicate email" do
    visit page_url
    fill_in "Email", with: ""
    fill_in "Email", with: users(:actor).email
    click_on "Save"
    take_screenshot
    assert_text "Email has already been taken"
  end

  test "can not update password with pawned password" do
    visit setting_password_url
    fill_in "Old Password", with: "random123"
    fill_in "New Password", with: "Home@123"
    fill_in "Confirm New Password", with: "Home@123"
    click_on "Save"
    sleep(1)
    take_screenshot
    assert_text "New password has previously appeared in a data breach and should not be used"
  end

  test "can not update password with empty fields" do
    visit setting_password_url
    click_on "Save"
    take_screenshot
    assert_text "Original password can't be blank"
    assert_text "New password can't be blank"
    assert_text "New password confirmation can't be blank"
    assert_text "Original password is not correct"
    assert_text "New password is too short (minimum is 6 characters)"
  end

  test "can send invite to user" do
    visit new_user_invitation_url
    email = "john.doe@crownstack.com"
    fill_in "user_email", with: email
    click_on "Send an invitation"
    take_screenshot
    assert_selector "p.notice", text: "An invitation email has been sent to #{email}"
  end

  test "can update permission to user" do
    sign_out @user
    @user= users(:admin)
    sign_in @user
    visit user_index_url
    take_screenshot
    p= users(:regular)
    find(id:dom_id(p)).click_link("Edit")
    assert_text "Edit #{p.decorate.display_name}'s Permission"
    select "HR", from: "user_permission"
    click_on "Save"
    take_screenshot
    within "##{dom_id(p)}" do
      assert_text "Hr"
    end
  end
end
