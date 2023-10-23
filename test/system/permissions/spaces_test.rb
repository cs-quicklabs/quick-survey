require "application_system_test_case"

class SpacesTest < ApplicationSystemTestCase
  setup do
    @user = users(:admin)
    @account = @user.account
    ActsAsTenant.current_tenant = @account
    @space = spaces(:seven)
    sign_in @user
  end

  def page_url
    spaces_url(script_name: "/#{@account.id}")
  end

  def space_page_url
    space_folders_url(script_name: "/#{@account.id}", space_id: @space.id)
  end

  test "admin can create a new space" do
    visit page_url
    take_screenshot
    assert_selector "h1", text: "Spaces"
    assert_text "Add New Space"
    take_screenshot
  end

  test "member can not create a new space" do
    sign_in users(:member)
    visit page_url
    take_screenshot
    assert_selector "h1", text: "Spaces"
    assert_no_text "Add New Space"
    take_screenshot
  end

  test "admin can create new folder or edit archive space" do
    visit space_page_url
    within "#space-header" do
      assert_text "Add New Folder"
      click_on "space-menu"
      assert_text "Edit"
      assert_text "Archive"
      assert_text(/Pin|Unpin/)
    end
    take_screenshot
  end

  test "member can not create new folder or edit archive space" do
    sign_in users(:member)
    visit space_page_url
    within "#space-header" do
      assert_no_text "Add New Folder"
      click_on "space-menu"
      assert_no_text "Edit"
      assert_no_text "Archive"
      assert_text(/Pin|Unpin/)
    end
    take_screenshot
  end

  test "admin can create new suvey inside folder or edit, delete folder" do
    visit space_page_url
    page.execute_script("arguments[0].click();", find("a", text: @space.folders.first.title))
    within "#folder-header" do
      assert_text "Add New Survey"
      click_on "folder-menu"
      assert_text "Edit"
      assert_text "Delete"
    end
    take_screenshot
  end

  test "member can not create new suvey inside folder or edit delete folder" do
    sign_in users(:member)
    visit space_page_url
    page.execute_script("arguments[0].click();", find("a", text: @space.folders.first.title))
    within "#folder-header" do
      assert_no_text "Add New Survey"
      assert has_no_selector?("#folder-menu")
    end
    take_screenshot
  end

  test "admin can edit clone archive change folder of survey" do
    visit space_page_url
    @folder = @space.folders.first
    page.execute_script("arguments[0].click();", find("a", text: @folder.title))
    @survey = @folder.survey_surveys.first
    within "tr##{dom_id(@survey)}" do
      click_on "survey-menu"
      assert_text "Edit"
      assert_text "Archive"
      assert_text "Show"
      assert_text "Change Folder"
      assert_text "Pin Survey" or assert_text "Unpin Survey"
    end
    take_screenshot
  end

  test "member can not edit clone archive change folder of survey" do
    sign_in users(:member)
    visit space_page_url
    @folder = @space.folders.first
    page.execute_script("arguments[0].click();", find("a", text: @folder.title))
    @survey = @folder.survey_surveys.first
    within "tr##{dom_id(@survey)}" do
      click_on "survey-menu"
      assert_no_text "Edit"
      assert_no_text "Archive"
      assert_no_text "Change Folder"
      assert_text (/Pin Survey|Unpin Survey/)
      assert_text "Show"
    end
    take_screenshot
  end

  test "admin can access archived spaces" do
    @space = spaces(:archived)
    visit space_page_url
    within "#space-header" do
      assert_no_text "Add New Folder"
      click_on "space-menu"
      assert_no_text "Edit"
      assert_text "Unarchive"
      assert_no_text(/Pin|Unpin/)
    end
    take_screenshot
  end

  test "admin can access folder of archived spaces" do
    @space = spaces(:archived)
    visit space_page_url
    folder = @space.folders.first
    page.execute_script("arguments[0].click();", find("a", text: @space.folders.first.title))
    within "#folder-header" do
      assert_no_text "Add New Survey"
      assert_no_selector("#folder-menu")
    end
    take_screenshot
  end

  test "admin can access surveys of archived spaces" do
    @space = spaces(:archived)
    visit space_page_url
    @folder = @space.folders.first
    page.execute_script("arguments[0].click();", find("a", text: @folder.title))
    @survey = @folder.survey_surveys.first
    within "tr##{dom_id(@survey)}" do
      click_on "survey-menu"
      assert_no_text "Edit"
      assert_no_text "Change Folder"
      assert_text "Show"
      assert_text "Archive"
      assert_no_text "Pin Survey" or assert_text "Unpin Survey"
    end
    take_screenshot
  end

  test "admin cannot view archived survey in space" do
    @folder = folders(:one)
    @space = @folder.space
    visit space_page_url
    page.execute_script("arguments[0].click();", find("a", text: @folder.title))
    assert_no_text "Project Initiation Checklist Archived"
    assert_text @folder.survey_surveys.active.first.name
    take_screenshot
  end
end
